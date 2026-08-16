[CmdletBinding()]
param(
    [switch]$NoLaunch,
    [switch]$KeepExisting
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$appPath = Join-Path $repoRoot 'build\bin\GoNavi.exe'
$appDirectory = Split-Path -Parent $appPath

Set-Location $repoRoot

function Write-Stage {
    param([string]$Message)

    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

if (-not (Get-Command wails -ErrorAction SilentlyContinue)) {
    throw '找不到 wails 命令。请先安装 Wails CLI，并确认其所在目录已加入 PATH。'
}

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot 'wails.json'))) {
    throw "当前目录不是 GoNavi 项目根目录：$repoRoot"
}

$existing = Get-Process -Name 'GoNavi' -ErrorAction SilentlyContinue |
    Where-Object { $_.Path -and ([System.IO.Path]::GetFullPath($_.Path) -ieq [System.IO.Path]::GetFullPath($appPath)) }

if ($existing) {
    if ($KeepExisting) {
        throw '检测到 GoNavi.exe 正在运行，无法在 -KeepExisting 模式下覆盖构建产物。请先关闭旧实例。'
    }

    Write-Stage '关闭正在运行的 GoNavi'
    $existing | Stop-Process -Force
    Start-Sleep -Milliseconds 500
}

Write-Host "GoNavi 一键构建与启动" -ForegroundColor White
Write-Host "项目目录: $repoRoot"
Write-Host ("当前分支: {0}" -f (git branch --show-current))

Write-Stage '执行完整 Wails 构建'
& wails build -clean
$buildExitCode = $LASTEXITCODE
if ($buildExitCode -ne 0) {
    throw "wails build -clean 失败，退出码：$buildExitCode。未启动应用。"
}

if (-not (Test-Path -LiteralPath $appPath)) {
    throw "构建命令成功但没有找到产物：$appPath"
}

$artifact = Get-Item -LiteralPath $appPath
Write-Host ("构建成功: {0} ({1:n1} MB)" -f $artifact.FullName, ($artifact.Length / 1MB)) -ForegroundColor Green

Write-Stage '检查构建产物状态'
git status --short

if ($NoLaunch) {
    Write-Host "`n已按 -NoLaunch 跳过启动。" -ForegroundColor Yellow
    exit 0
}

Write-Stage '启动构建后的 GoNavi'
$process = Start-Process -FilePath $appPath -WorkingDirectory $appDirectory -PassThru
Write-Host ("应用已启动，PID: {0}" -f $process.Id) -ForegroundColor Green
Write-Host '现在可以在应用中进行人工运行验证。'
