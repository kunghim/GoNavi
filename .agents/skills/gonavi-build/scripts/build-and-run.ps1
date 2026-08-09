[CmdletBinding()]
param(
    [switch]$NoLaunch,
    [switch]$KeepExisting
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')).Path
$appPath = Join-Path $repoRoot 'build\bin\GoNavi.exe'
$appDirectory = Split-Path -Parent $appPath
$generatedFiles = @(
    'frontend/package.json.md5',
    'frontend/wailsjs/go/aiservice/Service.d.ts',
    'frontend/wailsjs/go/aiservice/Service.js',
    'frontend/wailsjs/go/app/App.d.ts',
    'frontend/wailsjs/go/app/App.js',
    'frontend/wailsjs/go/models.ts',
    'frontend/wailsjs/go/nativewindow/Manager.d.ts',
    'frontend/wailsjs/go/nativewindow/Manager.js',
    'frontend/wailsjs/runtime/package.json',
    'frontend/wailsjs/runtime/runtime.d.ts',
    'frontend/wailsjs/runtime/runtime.js',
    'go.mod'
)

Set-Location $repoRoot

function Write-Stage {
    param([string]$Message)

    Write-Host ''
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-TrackedStatusMap {
    param([string[]]$Paths)

    $statusMap = @{}
    foreach ($line in (git status --porcelain -- @Paths)) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        $path = $line.Substring(3).Trim()
        if (-not $statusMap.ContainsKey($path)) {
            $statusMap[$path] = $line.Substring(0, 2)
        }
    }

    return $statusMap
}

if (-not (Get-Command wails -ErrorAction SilentlyContinue)) {
    throw '找不到 wails 命令。请先安装 Wails CLI，并确认其所在目录已加入 PATH。'
}

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot 'wails.json'))) {
    throw "当前目录不是 GoNavi 项目根目录：$repoRoot"
}

$preBuildStatus = Get-TrackedStatusMap -Paths $generatedFiles

$existing = Get-Process -Name 'GoNavi' -ErrorAction SilentlyContinue |
    Where-Object { $_.Path -and ([System.IO.Path]::GetFullPath($_.Path) -ieq [System.IO.Path]::GetFullPath($appPath)) }

if ($existing) {
    if ($KeepExisting) {
        throw '检测到 GoNavi.exe 正在运行，且当前使用了 -KeepExisting。请先手动关闭旧实例。'
    }

    Write-Stage '关闭正在运行的 GoNavi'
    $existing | Stop-Process -Force
    Start-Sleep -Milliseconds 500
}

Write-Host 'GoNavi 一键构建与启动' -ForegroundColor White
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

Write-Stage '恢复仅由构建产生的已知生成文件'
$postBuildStatus = Get-TrackedStatusMap -Paths $generatedFiles
$restoreTargets = [System.Collections.Generic.List[string]]::new()

foreach ($file in $generatedFiles) {
    if ($postBuildStatus.ContainsKey($file) -and -not $preBuildStatus.ContainsKey($file)) {
        $restoreTargets.Add($file)
    }
}

if ($restoreTargets.Count -gt 0) {
    git restore -- $restoreTargets
    if ($LASTEXITCODE -ne 0) {
        throw 'git restore 失败，无法恢复构建副作用文件。'
    }
    Write-Host ("已恢复: {0}" -f ($restoreTargets -join ', ')) -ForegroundColor Green
}
else {
    Write-Host '没有需要自动恢复的生成文件。' -ForegroundColor Green
}

Write-Stage '检查构建后的工作区状态'
git status --short

if ($NoLaunch) {
    Write-Host ''
    Write-Host '已按 -NoLaunch 跳过启动。' -ForegroundColor Yellow
    exit 0
}

Write-Stage '启动构建后的 GoNavi'
$process = Start-Process -FilePath $appPath -WorkingDirectory $appDirectory -PassThru
Write-Host ("应用已启动，PID: {0}" -f $process.Id) -ForegroundColor Green
Write-Host '现在可以在应用中进行人工运行验证。'
