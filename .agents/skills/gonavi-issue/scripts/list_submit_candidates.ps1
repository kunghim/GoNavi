param(
    [string]$FindingsPath = '.agents/findings.yaml'
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $FindingsPath -PathType Leaf)) {
    throw "发现清单不存在: $FindingsPath"
}

$findingsText = Get-Content -LiteralPath $FindingsPath -Raw -Encoding utf8
$activeMatch = [regex]::Match($findingsText, '(?ms)^active_findings:\s*(.*?)(?=^[A-Za-z_][A-Za-z0-9_-]*:\s*|\z)')
if (-not $activeMatch.Success) { throw '发现清单缺少 active_findings 区域' }
$matches = [regex]::Matches($activeMatch.Groups[1].Value, '(?ms)^\s*- id:\s*(FIND-[A-Z0-9-]+)\s*$.*?(?=^\s*- id:\s*FIND-|\z)')
$candidates = foreach ($match in $matches) {
    $block = $match.Value
    $titleMatch = [regex]::Match($block, '(?m)^\s*title:\s*([^\r\n]+)')
    $statusMatch = [regex]::Match($block, '(?m)^\s*status:\s*([^\r\n]+)')
    $verificationMatch = [regex]::Match($block, '(?m)^\s*verification_status:\s*([^\r\n]+)')
    $issueUrlMatch = [regex]::Match($block, '(?m)^\s*issue_url:\s*([^\r\n]*)')
    $issueUrl = if ($issueUrlMatch.Success) { $issueUrlMatch.Groups[1].Value.Trim('"'' ') } else { $null }
    $status = if ($statusMatch.Success) { $statusMatch.Groups[1].Value.Trim('"'' ') } else { $null }
    if ($titleMatch.Success -and $verificationMatch.Success -and $issueUrlMatch.Success -and -not $issueUrl -and $status -in @('待修复','修复待验证')) {
        [pscustomobject]@{
            id = ([regex]::Match($block, '^\s*- id:\s*(FIND-[A-Z0-9-]+)', 'Multiline')).Groups[1].Value
            title = $titleMatch.Groups[1].Value.Trim('"'' ')
            verification_status = $verificationMatch.Groups[1].Value.Trim('"'' ')
        }
    }
}

if (-not $candidates) {
    Write-Output '没有可提交的活跃发现。'
    exit 0
}

$candidates | Format-Table -AutoSize
