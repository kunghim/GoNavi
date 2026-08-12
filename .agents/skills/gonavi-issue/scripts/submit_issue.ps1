param(
    [Parameter(Mandatory = $true)] [ValidatePattern('^FIND-[A-Z0-9-]+$')] [string]$FindingId,
    [string]$Repo = 'Syngnat/GoNavi',
    [string]$FindingsPath = '.agents/findings.yaml',
    [switch]$DryRun,
    [switch]$Confirm
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $FindingsPath -PathType Leaf)) {
    throw "发现清单不存在: $FindingsPath"
}

$findingsText = Get-Content -LiteralPath $FindingsPath -Raw -Encoding utf8
$activeMatch = [regex]::Match($findingsText, '(?ms)^active_findings:\s*(.*?)(?=^[A-Za-z_][A-Za-z0-9_-]*:\s*|\z)')
if (-not $activeMatch.Success) { throw '发现清单缺少 active_findings 区域' }
$activeText = $activeMatch.Groups[1].Value
$findingPattern = '(?ms)^\s*- id:\s*' + [regex]::Escape($FindingId) + '\s*$.*?(?=^\s*- id:\s*FIND-|\z)'
$findingMatch = [regex]::Match($activeText, $findingPattern)
if (-not $findingMatch.Success) { throw "发现清单中不存在活跃发现: $FindingId" }
$findingBlock = $findingMatch.Value
$statusMatch = [regex]::Match($findingBlock, '(?m)^\s*status:\s*([^\r\n]+)')
if (-not $statusMatch.Success -or $statusMatch.Groups[1].Value.Trim('"'' ') -notin @('待修复','修复待验证')) {
    throw "发现 $FindingId 不是可提交的活跃状态"
}
$field = @{}
foreach ($name in @('title','type','severity','confidence','conclusion','impact','recommendation','verification_status','verification_path')) {
    $m = [regex]::Match($findingBlock, '(?m)^\s*' + $name + ':\s*([^\r\n]+)')
    if ($m.Success) { $field[$name] = $m.Groups[1].Value.Trim('"''') }
}
if (-not $field.title -or -not $field.conclusion) { throw "发现 $FindingId 缺少标题或结论" }
if (-not $field.type -or -not $field.verification_status) { throw "发现 $FindingId 缺少类型或验证状态" }
$allowedVerification = @('待验证','自动化测试确认','受控验证确认','已验证','代码证据确认','代码证据未运行时验证')
if ($field.verification_status -notin $allowedVerification) { throw "发现 $FindingId 的验证状态不受支持: $($field.verification_status)" }
if ($field.type -match 'Bug|缺陷|不一致') { $type = 'bug' }
elseif ($field.type -match '缺口|需求|能力') { $type = 'enhancement' }
else { throw "发现 $FindingId 的类型不受支持: $($field.type)" }
$titlePrefix = if ($type -eq 'bug') { '[Bug]' } else { '[Enhancement]' }
$Title = "$titlePrefix $($field.title)"
$acceptance = [regex]::Match($findingBlock, '(?m)^\s*acceptance_criteria:\s*\[(.*?)\]\s*$')
$acceptanceText = if ($acceptance.Success) { ($acceptance.Groups[1].Value -split ',\s*' | ForEach-Object { '- ' + $_.Trim('"'' ') }) -join "`n" } else { '- 按发现清单中的验收标准完成并补充回归测试。' }
$evidence = [regex]::Match($findingBlock, '(?m)^\s*evidence:\s*\[(.*?)\]\s*$')
$evidenceText = if ($evidence.Success) { ($evidence.Groups[1].Value -split ',\s*' | ForEach-Object { '- `' + $_.Trim('"'' ') + '`' }) -join "`n" } else { '- 详见 `.agents/findings.yaml` 对应发现。' }
$body = @"
## 来源与验证状态

- 来源：`gonavi-scan`
- 发现 ID：$FindingId
- 验证状态：$($field.verification_status)
- 严重度：$($field.severity)
- 置信度：$($field.confidence)

## 当前问题

$($field.conclusion)

## 影响

$($field.impact)

## 代码与测试证据

$evidenceText

验证路径：$($field.verification_path)

## 建议方向

$($field.recommendation)

## 验收标准

$acceptanceText

---
提交方式：AI 辅助整理，人工确认后提交
验证状态：$($field.verification_status)
"@
$sensitivePattern = '(?i)(password|passwd|token|api[_ -]?key|private key|authorization:|postgres(?:ql)?://|mysql://|mongodb(?:\+srv)?://|jdbc:|-----BEGIN [A-Z ]+PRIVATE KEY-----)'
foreach ($value in @($field.title,$field.conclusion,$field.impact,$field.recommendation,$field.verification_path,$evidenceText,$acceptanceText)) {
    if ($value -match $sensitivePattern) { throw "发现 $FindingId 含疑似敏感信息，已停止提交" }
}
$issueUrlMatch = [regex]::Match($findingBlock, '(?m)^\s*issue_url:\s*([^\r\n]*)')
if (-not $issueUrlMatch.Success) { throw "发现 $FindingId 缺少 issue_url 字段" }
$existingIssueUrl = $issueUrlMatch.Groups[1].Value.Trim('"''')
if ($existingIssueUrl) { throw "发现 $FindingId 已提交 Issue: $existingIssueUrl" }

gh auth status | Out-Host
if ($LASTEXITCODE -ne 0) { throw 'GitHub CLI 未认证或认证状态异常' }
$repoJson = gh api "repos/$Repo"
if ($LASTEXITCODE -ne 0) { throw "无法读取目标仓库: $Repo" }
$repoInfo = $repoJson | ConvertFrom-Json
if (-not $repoInfo.has_issues) {
    throw "目标仓库未启用 Issues: $Repo"
}

$idSearchOutput = gh issue list --repo $Repo --state all --limit 100 --search $FindingId --json number,title,body,state 2>&1
if ($LASTEXITCODE -ne 0) { throw "Issue 查重失败（发现 ID：$FindingId）: $idSearchOutput" }
try { $idSearchItems = @($idSearchOutput | ConvertFrom-Json) } catch { throw 'Issue 查重返回无效 JSON' }
$idDuplicates = @($idSearchItems | Where-Object { ((@($_.title, $_.body) -join "`n").IndexOf($FindingId, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) })
if ($idDuplicates.Count -gt 0) {
    $items = $idDuplicates | ForEach-Object { '{0} {1} {2}' -f $_.number, $_.state, $_.title }
    throw "发现 ID 已存在于远端 Issue，已停止提交:`n$($items -join "`n")"
}
$related = [System.Collections.Generic.List[string]]::new()
foreach ($term in @($field.title, $field.conclusion) | Where-Object { $_ -and $_.Trim().Length -ge 8 } | Select-Object -Unique) {
    $searchOutput = gh issue list --repo $Repo --state all --limit 20 --search $term --json number,title,body,state 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Issue 相似项查询失败（关键词：$term）: $searchOutput" }
    try { $searchItems = @($searchOutput | ConvertFrom-Json) } catch { throw 'Issue 相似项查询返回无效 JSON' }
    foreach ($item in $searchItems) {
        $haystack = @($item.title, $item.body) -join "`n"
        if ($haystack.IndexOf($term, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) { [void]$related.Add(('{0} {1} {2}' -f $item.number, $item.state, $item.title)) }
    }
}
$related = @($related | Sort-Object -Unique)
if ($related.Count -gt 0) {
    Write-Warning "发现可能相关的远端 Issue，请在确认前人工核对：`n$($related -join "`n")"
}

$labels = @($type, 'ai-discovered')
Write-Output "目标仓库: $Repo"
Write-Output "标题: $Title"
Write-Output "标签: $($labels -join ', ')"
Write-Output "正文来源: $FindingsPath ($FindingId)"
Write-Output "正文预览:`n$body"

if ($DryRun -or -not $Confirm) {
    Write-Output '模式: 草稿/预检，未创建 Issue'
    exit 0
}

$createArgs = @('issue', 'create', '--repo', $Repo, '--title', $Title, '--body', $body)
foreach ($label in $labels) { $createArgs += @('--label', $label) }
$url = (gh @createArgs | Select-Object -Last 1).ToString().Trim()
if ($LASTEXITCODE -ne 0) { throw "Issue 创建失败: $url" }
if ($url -notmatch '^https://github\.com/([^/]+)/([^/]+)/issues/[0-9]+$') {
    throw "创建命令未返回有效 Issue URL: $url"
}
$urlRepo = "$($Matches[1])/$($Matches[2])"
if ($urlRepo -ine $Repo) { throw "Issue URL 仓库与目标不一致: $urlRepo != $Repo" }

$createdJson = gh issue view $url --repo $Repo --json number,title,state,labels,body
if ($LASTEXITCODE -ne 0) { throw "Issue 已创建但回读失败，请人工核验: $url" }
$created = $createdJson | ConvertFrom-Json
$createdLabels = @($created.labels | ForEach-Object { $_.name })
$bodyId = [regex]::Match([string]$created.body, '(?m)^\s*-?\s*发现 ID：\s*`?([A-Z0-9-]+)').Groups[1].Value
if ($created.title -ne $Title -or $created.state -ne 'OPEN' -or $createdLabels -notcontains $type -or $createdLabels -notcontains 'ai-discovered' -or $bodyId -ne $FindingId) {
    throw "Issue 已创建但回读校验失败，请人工核验: $url"
}

$updatedFindings = [regex]::Replace($findingsText, '(?ms)(^\s*- id:\s*' + [regex]::Escape($FindingId) + '\s*$.*?^\s*issue_url:\s*)\S*', ('$1' + $url.Trim()), 1)
if ($updatedFindings -eq $findingsText) { throw "Issue 已创建但无法回写发现清单，请人工核验: $url" }
Set-Content -LiteralPath $FindingsPath -Value $updatedFindings -Encoding utf8

Write-Output "已创建并校验: $url"
