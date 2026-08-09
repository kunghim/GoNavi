param(
    [string]$FindingsPath = '.agents/findings.yaml',
    [string]$ArchivePath = '.agents/findings-archive.md',
    [string]$InventoryPath = '.agents/skills/gonavi-scan/config/entry-inventory.yaml',
    [string]$CapabilityMapPath = '.agents/skills/gonavi-scan/capability-map.md',
    [string]$CapabilitiesDir = '.agents/skills/gonavi-scan/capabilities',
    [string]$StatePath = '.agents/skills/gonavi-scan/config/state.yaml',
    [string]$ExpectedHeadCommit
)

$ErrorActionPreference = 'Stop'
$gitRootOutput = & git rev-parse --show-toplevel 2>$null
$repoRoot = if ($gitRootOutput) { ($gitRootOutput -join "`n").Trim() } else { $null }
if (-not $repoRoot) {
    $repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\..\..'))
}
function Resolve-RepoPath([string]$path) {
    if ([IO.Path]::IsPathRooted($path)) { return $path }
    return (Join-Path $repoRoot $path)
}
$FindingsPath = Resolve-RepoPath $FindingsPath
$ArchivePath = Resolve-RepoPath $ArchivePath
$InventoryPath = Resolve-RepoPath $InventoryPath
$CapabilityMapPath = Resolve-RepoPath $CapabilityMapPath
$CapabilitiesDir = Resolve-RepoPath $CapabilitiesDir
$StatePath = Resolve-RepoPath $StatePath
$allowedStatuses = @('待修复', '修复待验证')
$allowedVerification = @('代码证据确认', '自动化测试确认', '测试环境只读确认', '受控验证确认', '待验证')
$sensitivePatterns = @('(?im)^\s*(password|token|authorization|api[_-]?key|secret)\s*:', '-----BEGIN [A-Z ]*PRIVATE KEY-----', '(?i)(mongodb(\+srv)?|postgres(ql)?|mysql|redis|kafka|amqp|mqtt|https?)://[^\s/@:]+:[^\s/@]+@', '(?i)\bBearer\s+[A-Za-z0-9._~-]{12,}')

foreach ($path in @($FindingsPath, $ArchivePath, $InventoryPath, $CapabilityMapPath, $StatePath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "缺少必需文件: $path" }
}
if (-not (Test-Path -LiteralPath $CapabilitiesDir -PathType Container)) { throw "缺少能力分册目录: $CapabilitiesDir" }
$capabilityFiles = @(Get-ChildItem -LiteralPath $CapabilitiesDir -Filter '*.md' -File)
if ($capabilityFiles.Count -eq 0) { throw '能力分册目录为空' }

$findings = Get-Content -LiteralPath $FindingsPath -Raw -Encoding utf8
$findingsScanId = ([regex]::Match($findings, '(?m)^scan_id:\s*(.+?)\s*$')).Groups[1].Value.Trim()
$findingsHeadCommit = ([regex]::Match($findings, '(?m)^head_commit:\s*([0-9a-f]{7,40})\s*$')).Groups[1].Value.Trim()
if (-not $findingsScanId -or -not $findingsHeadCommit) { throw 'findings.yaml 缺少 scan_id 或 head_commit' }
$ids = @([regex]::Matches($findings, '(?m)^\s*- id:\s*(FIND-[A-Z0-9-]+)\s*$') | ForEach-Object { $_.Groups[1].Value })
if ($ids.Count -ne @($ids | Select-Object -Unique).Count) { throw 'findings.yaml 包含重复发现 ID' }
foreach ($id in $ids) {
    $block = [regex]::Match($findings, "(?ms)^\s*- id:\s*$([regex]::Escape($id))\s*$.*?(?=^\s*- id:|\z)").Value
    foreach ($field in @('title:', 'status:', 'type:', 'severity:', 'confidence:', 'affected_capabilities:', 'conclusion:', 'evidence:', 'impact:', 'recommendation:', 'acceptance_criteria:', 'first_seen_commit:', 'affected_paths:', 'verification_status:', 'verification_path:', 'verification_details:', 'review_history:', 'last_checked_result:')) {
        if ($block -notmatch [regex]::Escape($field)) { throw "$id 缺少字段: $field" }
    }
    $status = ([regex]::Match($block, '(?m)^\s*status:\s*(.+?)\s*$')).Groups[1].Value.Trim()
    if ($status -notin $allowedStatuses) { throw "$id 使用了不允许的活跃状态: $status" }
    $verification = ([regex]::Match($block, '(?m)^\s*verification_status:\s*(.+?)\s*$')).Groups[1].Value.Trim()
    if ($verification -notin $allowedVerification) { throw "$id 使用了不允许的验证状态: $verification" }
    foreach ($field in @('mode:', 'instance_id:', 'verified_at:', 'result:')) {
        if ($block -notmatch "(?m)^\s+$([regex]::Escape($field))\s*\S") { throw "$id 的 verification_details 缺少字段: $field" }
    }
    $mode = ([regex]::Match($block, '(?m)^\s*mode:\s*(.+?)\s*$')).Groups[1].Value.Trim()
    if ($mode -notin @('只读验证', '受控验证')) { throw "$id 使用了不允许的验证模式: $mode" }
    if ($verification -eq '受控验证确认' -and $mode -ne '受控验证') { throw "$id 的受控验证确认必须使用受控验证模式" }
    if ($verification -ne '受控验证确认' -and $mode -eq '受控验证') { throw "$id 的受控验证模式必须使用受控验证确认状态" }
    if ($verification -eq '受控验证确认') {
        foreach ($field in @('human_approval:', 'temporary_resources:', 'cleanup_result:')) {
            if ($block -notmatch "(?m)^\s+$([regex]::Escape($field))\s*\S") { throw "$id 的受控验证缺少字段: $field" }
        }
        if ($findingsScanId -notlike 'state-migration-*' -and ($block -match '(?im)human_approval:\s*(未|无|否|历史)' -or $block -notmatch '(?im)human_approval:\s*.*批准人.+批准时间')) { throw "$id 的受控验证缺少有效人工批准" }
    }
    $verifiedAt = ([regex]::Match($block, '(?m)^\s*verified_at:\s*(.+?)\s*$')).Groups[1].Value.Trim()
    $parsedVerifiedAt = [DateTimeOffset]::MinValue
    if ($findingsScanId -notlike 'state-migration-*' -and $verification -eq '待验证' -and $verifiedAt -ne '未执行' -and -not [DateTimeOffset]::TryParse($verifiedAt, [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::RoundtripKind, [ref]$parsedVerifiedAt)) { throw "$id 的 verified_at 不是有效 ISO 时间或未执行" }
    if ($findingsScanId -notlike 'state-migration-*' -and $verification -ne '待验证' -and -not [DateTimeOffset]::TryParse($verifiedAt, [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::RoundtripKind, [ref]$parsedVerifiedAt)) { throw "$id 的 verified_at 不是有效 ISO 时间" }
    if ($findingsScanId -notlike 'state-migration-*' -and $block -match '历史迁移未记录|历史未知') { throw "$id 不能在新扫描中使用历史迁移占位值" }
}

$archive = Get-Content -LiteralPath $ArchivePath -Raw -Encoding utf8
if ($archive -notmatch '(?m)^\| ID \| 问题 \| 归档原因 \|') { throw 'findings-archive.md 缺少归档表头' }
$archiveIds = @()
foreach ($line in ($archive -split "`r?`n")) {
    if ($line -notmatch '^\|\s*(FIND-[A-Z0-9-]+)\s*\|') { continue }
    $cells = @($line.Trim('|').Split('|') | ForEach-Object { $_.Trim() })
    if ($cells.Count -ne 8) { throw "归档表格列数错误: $line" }
    if (@($cells | Where-Object { -not $_ }).Count -gt 0) { throw "归档记录缺少必填内容: $($cells[0])" }
    if ($cells[2] -notmatch '^(已修复|明确不修复)') { throw "归档原因必须以已修复或明确不修复说明: $($cells[0])" }
    $archiveIds += $cells[0]
}
if ($archiveIds.Count -ne @($archiveIds | Select-Object -Unique).Count) { throw 'findings-archive.md 包含重复发现 ID' }
if (@($archiveIds | Where-Object { $_ -in $ids }).Count -gt 0) { throw '活跃发现与归档发现不能包含相同 ID' }
$inventory = Get-Content -LiteralPath $InventoryPath -Raw -Encoding utf8
if ($inventory -notmatch '(?m)^entries:' -or $inventory -notmatch '(?m)^\s+- id: ENTRY-') { throw 'entry-inventory.yaml 缺少入口记录' }
$inventoryScanId = ([regex]::Match($inventory, '(?m)^scan_id:\s*(.+?)\s*$')).Groups[1].Value.Trim()
$inventoryHeadCommit = ([regex]::Match($inventory, '(?m)^head_commit:\s*([0-9a-f]{7,40})\s*$')).Groups[1].Value.Trim()
if (-not $inventoryScanId -or -not $inventoryHeadCommit) { throw 'entry-inventory.yaml 缺少 scan_id 或 head_commit' }
$inventoryIds = @([regex]::Matches($inventory, '(?m)^\s+- id:\s*(ENTRY-[A-Z0-9-]+)\s*$') | ForEach-Object { $_.Groups[1].Value })
if ($inventoryIds.Count -ne @($inventoryIds | Select-Object -Unique).Count) { throw 'entry-inventory.yaml 包含重复入口 ID' }
foreach ($entryId in $inventoryIds) {
    $entry = [regex]::Match($inventory, "(?ms)^\s+- id:\s*$([regex]::Escape($entryId))\s*$.*?(?=^\s+- id:|\z)").Value
    foreach ($field in @('category:', 'code_locations:', 'capability_ids:', 'coverage_status:', 'uncovered_reason:', 'next_validation:')) {
        if ($entry -notmatch [regex]::Escape($field)) { throw "$entryId 缺少字段: $field" }
    }
    $coverage = ([regex]::Match($entry, '(?m)^\s*coverage_status:\s*(.+?)\s*$')).Groups[1].Value.Trim()
    if ($coverage -notin @('已映射', '部分映射', '未覆盖')) { throw "$entryId 使用了不允许的覆盖状态: $coverage" }
    $capabilities = ([regex]::Match($entry, '(?m)^\s*capability_ids:\s*\[(.*?)\]\s*$')).Groups[1].Value.Trim()
    $reason = ([regex]::Match($entry, '(?m)^\s*uncovered_reason:\s*"?(.*?)"?\s*$')).Groups[1].Value.Trim()
    $nextValidation = ([regex]::Match($entry, '(?m)^\s*next_validation:\s*(.+?)\s*$')).Groups[1].Value.Trim()
    if ($coverage -eq '已映射' -and -not $capabilities) { throw "$entryId 已映射但未关联能力 ID" }
    if ($coverage -ne '已映射' -and (-not $reason -or -not $nextValidation)) { throw "$entryId 未完整覆盖但缺少原因或后续验证方式" }
}
$capabilityMap = Get-Content -LiteralPath $CapabilityMapPath -Raw -Encoding utf8
$capabilityContents = @{}
foreach ($file in $capabilityFiles) {
    $capabilityContents[$file.Name] = Get-Content -LiteralPath $file.FullName -Raw -Encoding utf8
}
$capabilityIdsByFile = @{}
foreach ($file in $capabilityFiles) {
    $idsInFile = @([regex]::Matches($capabilityContents[$file.Name], '(?m)^(?:###\s+|\|\s*)(CAP-[A-Z0-9]+(?:-[A-Z0-9]+)+)(?:\s|\|)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique)
    foreach ($capability in $idsInFile) {
        if (-not $capabilityIdsByFile.ContainsKey($capability)) { $capabilityIdsByFile[$capability] = @() }
        $capabilityIdsByFile[$capability] += $file.Name
    }
}
foreach ($capability in $capabilityIdsByFile.Keys) {
    if (@($capabilityIdsByFile[$capability] | Select-Object -Unique).Count -gt 1) { throw "能力 ID 出现在多个分册: $capability" }
}
$links = @([regex]::Matches($capabilityMap, '\]\(capabilities/([^\)]+)\)') | ForEach-Object { $_.Groups[1].Value })
foreach ($link in $links) {
    if (-not (Test-Path -LiteralPath (Join-Path $CapabilitiesDir $link) -PathType Leaf)) { throw "根索引链接的能力分册不存在: $link" }
}
$referencedCapabilities = @([regex]::Matches($inventory, 'CAP-[A-Z0-9-]+') | ForEach-Object { $_.Value } | Select-Object -Unique)
$referencedCapabilities += @([regex]::Matches($findings, 'CAP-[A-Z0-9-]+') | ForEach-Object { $_.Value } | Select-Object -Unique)
$referencedCapabilities = @($referencedCapabilities | Select-Object -Unique)
foreach ($capability in $referencedCapabilities) {
    if ($capability -match '\*|\.\.') { throw "入口账本或发现清单不能引用通配或范围能力 ID: $capability" }
    if (-not $capabilityIdsByFile.ContainsKey($capability)) { throw "入口账本或发现清单引用了不存在的规范能力 ID: $capability" }
}

if ($ExpectedHeadCommit) {
    $actualHead = (git -C $repoRoot rev-parse HEAD).Trim()
    if ($actualHead -ne $ExpectedHeadCommit) { throw "HEAD 不匹配。期望 $ExpectedHeadCommit，实际 $actualHead" }
}
$state = Get-Content -LiteralPath $StatePath -Raw -Encoding utf8
$scanId = ([regex]::Match($state, '(?m)^scan_id:\s*(.+?)\s*$')).Groups[1].Value.Trim()
$headCommit = ([regex]::Match($state, '(?m)^head_commit:\s*([0-9a-f]{7,40})\s*$')).Groups[1].Value.Trim()
$baselineStatus = ([regex]::Match($state, '(?m)^baseline_status:\s*(.+?)\s*$')).Groups[1].Value.Trim()
if (-not $scanId) { throw 'state.yaml 缺少 scan_id' }
if (-not $headCommit) { throw 'state.yaml 缺少 head_commit' }
if (-not $baselineStatus) { throw 'state.yaml 缺少 baseline_status' }
$actualHead = (git -C $repoRoot rev-parse HEAD).Trim()
if ($findingsScanId -ne $scanId -or $findingsHeadCommit -ne $headCommit) { throw 'findings.yaml 与 state.yaml 的 scan_id/head_commit 不一致' }
if ($inventoryScanId -ne $scanId -or $inventoryHeadCommit -ne $headCommit) { throw 'entry-inventory.yaml 与 state.yaml 的 scan_id/head_commit 不一致' }
$allowedBaselineStatus = @('ok', 'unavailable')
if ($baselineStatus -notin $allowedBaselineStatus) { throw "state.yaml 使用了不允许的 baseline_status: $baselineStatus" }
$baseline = ([regex]::Match($state, '(?m)^last_successful_commit:\s*([0-9a-f]{7,40})\s*$')).Groups[1].Value
if ($baseline) {
    & git -C $repoRoot cat-file -e "${baseline}^{commit}" 2>$null
    if ($LASTEXITCODE -ne 0) { throw "state.yaml 的基线提交不存在: $baseline；请置空该字段并执行全量扫描" }
}
if ($baselineStatus -eq 'ok' -and -not $baseline) { throw 'baseline_status 为 ok 时必须存在 last_successful_commit' }
if ($baselineStatus -eq 'unavailable' -and $baseline) { throw 'baseline_status 为 unavailable 时不得保留 last_successful_commit' }
foreach ($field in @('scan_mode:', 'started_at:', 'completed_at:', 'start_commit:', 'workspace_status:', 'included_scope:', 'excluded_scope:')) {
    if ($state -notmatch "(?m)^$([regex]::Escape($field))\s*\S") { throw "state.yaml 缺少扫描审计字段: $field" }
}
$scanMode = ([regex]::Match($state, '(?m)^scan_mode:\s*(.+?)\s*$')).Groups[1].Value.Trim()
if ($scanMode -notin @('全量扫描', '增量扫描', '状态迁移')) { throw "state.yaml 使用了不允许的 scan_mode: $scanMode" }
$workspaceStatus = ([regex]::Match($state, '(?m)^workspace_status:\s*(.+?)\s*$')).Groups[1].Value.Trim()
if ($workspaceStatus -notin @('干净', '有未提交改动', '历史未知')) { throw "state.yaml 使用了不允许的 workspace_status: $workspaceStatus" }
$startCommit = ([regex]::Match($state, '(?m)^start_commit:\s*(.+?)\s*$')).Groups[1].Value.Trim()
if ($startCommit -notmatch '^(历史未知|[0-9a-f]{7,40})$') { throw 'state.yaml 的 start_commit 格式无效' }
foreach ($mapPath in @($CapabilityMapPath) + @($capabilityFiles.FullName)) {
    $mapText = Get-Content -LiteralPath $mapPath -Raw -Encoding utf8
    $mapScanId = ([regex]::Match($mapText, '(?m)^> scan_id:\s*`?([^`\r\n]+)`?\s*$')).Groups[1].Value.Trim()
    $mapHead = ([regex]::Match($mapText, '(?m)^> head_commit:\s*`?([0-9a-f]{7,40})`?\s*$')).Groups[1].Value.Trim()
    if ($mapScanId -ne $scanId -or $mapHead -ne $headCommit) { throw "能力地图与 state.yaml 不一致: $mapPath" }
}
foreach ($path in @($FindingsPath, $ArchivePath, $InventoryPath, $CapabilityMapPath, $StatePath) + @($capabilityFiles.FullName)) {
    if (-not $path) { continue }
    $content = Get-Content -LiteralPath $path -Raw -Encoding utf8
    foreach ($pattern in $sensitivePatterns) {
        if ($content -match $pattern) { throw "疑似敏感信息，拒绝写入: $path" }
    }
}
Write-Output "校验通过: $($ids.Count) 个活跃发现"
