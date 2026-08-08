param(
    [Parameter(Mandatory = $true)] [string]$Title,
    [Parameter(Mandatory = $true)] [ValidateSet('bug', 'enhancement')] [string]$Type,
    [Parameter(Mandatory = $true)] [string]$BodyFile,
    [string]$Repo = 'Syngnat/GoNavi',
    [switch]$DryRun,
    [switch]$Confirm
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $BodyFile -PathType Leaf)) {
    throw "正文文件不存在: $BodyFile"
}

gh auth status | Out-Host
$repoInfo = gh api "repos/$Repo" | ConvertFrom-Json
if (-not $repoInfo.has_issues) {
    throw "目标仓库未启用 Issues: $Repo"
}

$body = Get-Content -LiteralPath $BodyFile -Raw -Encoding utf8
$requiredMarkers = @('来源：`gonavi-scan`', '发现 ID：', '验证状态：', '验收标准')
if ($Type -eq 'bug') {
    $requiredMarkers += @('最小复现步骤', '期望行为', '实际行为')
} else {
    $requiredMarkers += @('使用场景', '现状与痛点', '期望的功能')
}
foreach ($marker in $requiredMarkers) {
    if (-not $body.Contains($marker)) {
        throw "Issue 正文缺少必要字段: $marker"
    }
}

$duplicates = @(gh issue list --repo $Repo --state all --limit 20 --search $Title)
if ($duplicates.Count -gt 0) {
    throw "可能存在重复 Issue，已停止提交:`n$($duplicates -join "`n")"
}

$labels = @($Type, 'gonavi-scan')
Write-Output "目标仓库: $Repo"
Write-Output "标题: $Title"
Write-Output "标签: $($labels -join ', ')"
Write-Output "正文文件: $BodyFile"

if ($DryRun -or -not $Confirm) {
    Write-Output '模式: 草稿/预检，未创建 Issue'
    exit 0
}

$createArgs = @('issue', 'create', '--repo', $Repo, '--title', $Title, '--body-file', $BodyFile)
foreach ($label in $labels) { $createArgs += @('--label', $label) }
$url = gh @createArgs
if ($url -notmatch '^https://github\.com/[^/]+/[^/]+/issues/[0-9]+$') {
    throw "创建命令未返回有效 Issue URL: $url"
}

$created = gh issue view $url --repo $Repo --json number,title,state,labels,body | ConvertFrom-Json
$createdLabels = @($created.labels | ForEach-Object { $_.name })
if ($created.title -ne $Title -or $created.state -ne 'OPEN' -or $createdLabels -notcontains $Type -or $createdLabels -notcontains 'gonavi-scan' -or $created.body -notlike '*来源：`gonavi-scan`*') {
    throw "Issue 回读校验失败: $url"
}

Write-Output "已创建并校验: $url"
