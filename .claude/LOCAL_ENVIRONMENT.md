# 本机环境快照

本文件只记录当前开发机，不得复制到项目代码或 PR。最近验证：2026-08-01。

## 已验证

| 工具 | 状态 |
| --- | --- |
| Go | `go1.25.12 windows/amd64` |
| Go 安装目录 | `D:\\develop\\Go1.25` |
| GOPATH | `C:\\Users\\q1061\\go` |
| Wails | `v2.11.0` |
| Node.js | `v24.14.0`（CI 使用 Node 20，遇到前端兼容问题时优先切换 Node 20 LTS） |
| npm | `11.13.0` |
| WebView2 | `150.0.4078.105` |
| 第三方浏览器 | Paseo `mcp__paseo__browser_*`，可打开本地页面并执行快照、点击、输入、滚动、截图和日志检查 |
| Windows | Windows 11 Pro 25H2，amd64 |
| `wails doctor` | 通过 |
| Python | `3.12.4`，仅发布脚本/工具测试需要 |

## 注意事项

- `GOROOT` 不需要手动设置，Go 会从 `go.exe` 推导。
- `C:\\Users\\q1061\\go\\bin` 需要在 `PATH` 中，Wails CLI 安装在这里。
- 当前 `java` 曾解析到 Java 8，而 `javac` 解析到 JDK 17；运行 JVM 集成测试前应让两者来自同一套 JDK 17。
- GCC/MinGW 未安装；普通 Wails 开发不需要，可选 DuckDB driver-agent 构建时再安装 MSYS2 UCRT64 gcc/g++/binutils。

## 浏览器预览与验证

第三方宿主提供的 Paseo 浏览器可以直接访问已运行的本地开发服务。`browser_new_tab` 只负责创建标签页，不会替项目启动服务；开始验证时先检查目标端口，已有服务就直接导航到目标页面或路由，不要重复启动。

GoNavi 的 Wails 开发链路有两个本地地址：

- `http://localhost:34115`：Wails 浏览器开发代理。优先使用它验证完整页面，因为它能保留 Wails 前端绑定调用。
- `http://127.0.0.1:5173`：Vite 前端开发服务器。只适合不依赖 Go/Wails 绑定的纯前端页面。

没有运行中的服务时，使用仓库的快速开发入口：

```powershell
node tools/wails-fast-dev.mjs --no-install
```

等待日志出现 `Using DevServer URL` 和 `Using Frontend DevServer URL` 后，再用 Paseo 打开 `http://localhost:34115`。若已知目标页面 URL 或前端路由，可以直接打开完整 URL；否则从首页通过按钮进入目标区域。验证时使用 `browser_wait` 等待页面就绪，再用 `browser_snapshot` 检查结构和引用，必要时用 `browser_click`、`browser_fill`、`browser_evaluate`、`browser_logs` 和 `browser_screenshot`。截图若提示 `The tab has not painted yet`，先以 DOM 快照和日志为准并重试截图，不代表页面没有加载。

测试结束后关闭 Paseo 标签页和本次启动的进程，检查 `git status`。Wails 可能自动更新 `frontend/wailsjs` 生成文件；若这些改动只是启动产物，应恢复它们，确保不进入代码提交。

## 重新检查

仅在本快照超过 30 天、工具升级、命令解析失败或任务涉及对应构建链路时执行：

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

