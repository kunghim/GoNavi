# GoNavi 本地开发与交付规则

任务启动、恢复、切换、提交和 PR 的完整步骤见 `TASK_WORKFLOW.md`；本文件主要记录构建与测试命令。

## 分支模型

- `dev`：日常开发集成分支
- `main`：稳定发布分支
- `release/*`：发版准备分支
- 外部贡献通常从 Fork 的 `dev` 创建 `fix/*` 或 `feature/*`，PR 提交到上游 `Syngnat/GoNavi:dev`
- 一个 PR 只处理一类问题，避免把本地 AI 资料或无关格式化混入提交
- 共建流程和 PR 自检要求以 `CONTRIBUTING.zh-CN.md` 与 Issue #671 为依据

## 初始化

```powershell
go version
wails version
node --version
npm --version
node frontend/scripts/wails-frontend-install.mjs
go mod download
```

前端依赖由 `frontend/package-lock.json` 锁定，优先使用仓库脚本，不要随意切换包管理器。

## 开发与构建

```powershell
wails dev
node tools/wails-fast-dev.mjs
node tools/wails-fast-dev.mjs --refresh-bindings
wails build -clean
npm --prefix frontend run build
```

人工完成最终构建和运行验证时，可直接执行本地脚本：

```powershell
& .\.claude\scripts\build-and-run.ps1
```

脚本默认会先关闭同路径的旧 `GoNavi.exe`，再同步执行 `wails build -clean`，确认 `build\bin\GoNavi.exe` 生成后自动启动应用。构建失败不会启动旧产物；只构建不启动可使用 `-NoLaunch`，不希望自动关闭旧实例可使用 `-KeepExisting`。完整构建及构建后人工验证不由智能体自动执行。

Go 导出方法签名发生变化时，先运行 `wails generate module` 或使用带 `--refresh-bindings` 的快速开发脚本。

## 浏览器预览

开发任务需要观察界面时，优先复用已经运行的本地服务，并让第三方 Paseo 浏览器直接打开目标 URL 或路由。浏览器标签页不会替项目启动服务；没有服务时再运行：

```powershell
node tools/wails-fast-dev.mjs --no-install
```

完整 Wails 页面访问 `http://localhost:34115`，纯前端页面才访问 Vite 的 `http://127.0.0.1:5173`。打开后先等待页面，再做快照和交互验证；已知具体路径时直接导航到该路径，不必每次从首页进入。验证结束关闭测试标签页和开发进程，并检查启动过程中是否生成了未预期的 Wails 绑定差异。

## 测试分层

```powershell
# 后端完整套件
go test ./... -count=1 -timeout=30m

# 前端完整套件
npm --prefix frontend test

# 前端类型检查和生产构建
npm --prefix frontend run build
```

窄改动优先运行对应包或测试文件；涉及共享接口、跨模块流程、Wails 绑定或构建链路时再扩大验证范围。JVM 真实集成测试需要 `java` 和 `javac`；可选 DuckDB driver-agent 的 Windows 构建需要 CGO 和 MinGW/MSYS2。

## 提交前边界

只提交实现需求所需的代码、测试、必要的 i18n/构建资源。以下内容必须留在本地：

- `AGENTS.md`、`CLAUDE.md`、`.claude/` 下的上下文和任务草稿
- AI 对话记录、实现计划、设计草稿、环境快照和 PR 草稿
- 与当前需求无关的文档、重构或格式化

建议提交前确认：

```powershell
git status --short
git diff --stat
git diff --cached --name-status
git diff --cached --check
```
