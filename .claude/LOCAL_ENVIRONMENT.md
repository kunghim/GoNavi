# 本机环境要求与探测

本文件记录跨机器通用的工具要求、探测方式和常见排障方法，不保存某一台机器的用户名、安装目录或临时路径。内容只服务于当前 clone 的本地开发助手，不得复制到项目代码或 PR。

## 一、原则

1. **文档只写要求，不写死路径。** 每台机器的 Go、Wails、Node 等安装位置可能不同，也可能通过版本管理器、IDE 或临时解压目录提供。
2. **先探测，再执行命令。** 不要因为文档里写过某个路径就假设它存在；以当前 shell 实际解析到的命令和版本为准。
3. **找不到命令不等于未安装。** 先检查 PATH、IDE 配置、版本管理器和环境变量，再决定是否重新安装。
4. **机器专属记录不进 Git。** 确需保存本机绝对路径时，放在不纳入版本控制的本地文件中，不要写回本文件。

## 二、工具要求

| 工具 | 要求 | 说明 |
| --- | --- | --- |
| Go | `1.25.x` | 项目构建与后端测试；优先使用 `go.mod` 要求的 Go 版本 |
| Wails | `v2.11.x` | 桌面端开发与构建；以 `wails doctor` 结果为准 |
| Node.js | CI 使用 `20` LTS | 本地可使用更高版本；遇到前端兼容问题时优先切回 Node 20 LTS |
| npm | 随 Node.js 安装 | 前端依赖、测试与构建 |
| WebView2 | Windows 必需 | Wails 运行依赖；由系统或安装器提供 |
| Python | 可选 | 仅发布脚本或工具测试需要 |
| JDK | 可选，`17` | 仅 JVM 集成测试需要；`java` 与 `javac` 应来自同一套 JDK |
| GCC/MinGW | 可选 | 普通 Wails 开发不需要；仅在构建 DuckDB driver-agent 等原生依赖时安装 |

## 三、动态探测

在当前开发机的 shell 中执行以下命令，以实际输出为准。PowerShell 与 POSIX shell 均可使用。

### 3.1 解析命令位置

```powershell
# PowerShell
Get-Command go -ErrorAction SilentlyContinue
Get-Command wails -ErrorAction SilentlyContinue
Get-Command node -ErrorAction SilentlyContinue
Get-Command npm -ErrorAction SilentlyContinue
```

```bash
# bash / zsh
command -v go
command -v wails
command -v node
command -v npm
```

### 3.2 检查版本与环境

```powershell
go version
go env GOROOT GOPATH GOBIN GOOS GOARCH CGO_ENABLED
wails version
wails doctor
node --version
npm --version
java -version
javac -version
```

要点：

- `GOROOT` 通常由 `go.exe` 自动推导，不需要手动设置；只有当命令解析错误时才检查。
- `GOPATH`、`GOBIN` 以 `go env` 的实际输出为准，不要把某台机器的值写进文档或代码。
- Wails CLI 的可执行文件通常位于 Go 的 bin 目录；若 `wails` 找不到，先检查 `go env GOPATH` 和 `go env GOBIN`，再检查 PATH。
- `wails doctor` 能更完整地报告 WebView2、Node、平台构建工具等缺失项。

## 四、PATH 排障

### 4.1 Go 命令找不到

按以下顺序排查：

1. 确认 Go 是否已安装，而不是只看 PATH。
2. 尝试用 IDE（如 GoLand）配置的 SDK 或系统包管理器找到实际的 `go` 可执行文件。
3. 如果已经知道 Go 安装根目录，将其 `bin` 目录加入当前会话或用户 PATH，例如：
   ```powershell
   # 仅当前 PowerShell 会话；<go-root> 替换为实际安装根目录
   $env:Path = "<go-root>\bin;$env:Path"
   ```
   ```bash
   # 仅当前 shell 会话
   export PATH="<go-root>/bin:$PATH"
   ```
4. 如果使用临时解压目录，优先用其完整路径调用 `go`，不要假设它会被系统长期保留。
5. 重新打开终端后再次运行 `Get-Command go` 或 `command -v go`。

### 4.2 子 Agent 找不到工具

子 Agent 可能不继承主 Agent 的临时环境、IDE SDK 或当前会话 PATH。主 Agent 在委派需要运行命令的任务时，应：

- 先自行探测并确认可用工具链的完整路径；
- 在子 Agent 任务说明中显式给出该路径和验证命令；
- 不要把主 Agent 的临时路径写成项目文档或提交内容。

如果子 Agent 报告“工具不存在”，先按本节检查 PATH 和完整路径，再判断是否真的缺少依赖。

### 4.3 常见误判

- `go` 不在 PATH，但 IDE 内可以编译：这是 IDE 使用了独立 SDK，不等于系统 PATH 已配置。
- `wails` 不在 PATH，但 `go run` 可用：Wails CLI 可能安装在 `GOPATH/bin`，需要单独加入 PATH。
- `go env GOROOT` 有值，不代表 `go` 已加入 PATH；两者是不同问题。
- 临时目录中的工具链可能被清理；不要把它当作机器的持久安装。

## 五、浏览器预览与验证

如果当前宿主提供浏览器自动化工具，可以用它访问已运行的本地开发服务；`browser_new_tab` 只负责创建标签页，不会替项目启动服务。开始验证时先检查目标端口，已有服务就直接导航到目标页面或路由，不要重复启动。

GoNavi 的 Wails 开发链路有两个本地地址：

- `http://localhost:34115`：Wails 浏览器开发代理。优先使用它验证完整页面，因为它能保留 Wails 前端绑定调用。
- `http://127.0.0.1:5173`：Vite 前端开发服务器。只适合不依赖 Go/Wails 绑定的纯前端页面。

没有运行中的服务时，使用仓库的快速开发入口：

```powershell
node tools/wails-fast-dev.mjs --no-install
```

等待日志出现 `Using DevServer URL` 和 `Using Frontend DevServer URL` 后，再打开 `http://localhost:34115`。若已知目标页面 URL 或前端路由，可以直接打开完整 URL；否则从首页通过按钮进入目标区域。验证时优先等待页面就绪，再检查 DOM 结构、控制台日志和网络请求；截图若提示页面尚未绘制，先以 DOM 快照和日志为准并重试，不代表页面没有加载。

测试结束后关闭本次启动的进程和标签页，检查 `git status`。Wails 可能自动更新 `frontend/wailsjs` 生成文件；若这些改动只是启动产物，应恢复它们，确保不进入代码提交。

## 六、何时重新探测

工具升级、命令解析失败、任务涉及对应构建链路，或距离上次实际验证较久时，重新执行第三节的探测命令。不要为了维护一份“机器快照”而定期改写本文件。