# GoNavi 本地 AI 开发入口

本文件只服务于当前 clone 的本地开发助手，不属于项目交付内容。不要把它或 `.claude/` 下的上下文、任务草稿、环境快照提交到 PR。

## 开始工作前

1. 读取 `.claude/PROJECT_CONTEXT.md` 和 `.claude/DEVELOPMENT.md`。
2. 读取 `.claude/TASK_WORKFLOW.md`，先判断是新任务、继续旧任务还是切换任务，再执行对应 Git 流程。
3. 读取 `.claude/LOCAL_ENVIRONMENT.md`；只有记录过期、命令失败或任务涉及构建链路时才重新检查工具环境。
4. 根据任务读取 `.claude/MODULE_INDEX.md` 和对应模块的 `ARCHITECTURE.md` 内容，不要无目标地全量扫描仓库。
5. 检查 `git status --short --branch`，确认当前分支和用户已有改动。
6. 以 `upstream/dev` 为集成基线，用 `git diff --name-only <baseline>..HEAD` 了解新增范围；只有涉及的模块才继续深入。

## 交付边界

- 用户负责需求分析、缺陷修复、代码实现和向上游 `dev` 提交 PR。
- PR 只包含代码、测试、必要的多语言资源或构建配置；不要提交 AI 过程文档、设计草稿、环境记录、会话摘要或 PR 草稿。
- 遵循仓库现有 Go、React、TypeScript、Wails 和测试模式，避免无关重构。
- 修改前先阅读目标文件及其测试；修改后运行与风险匹配的最小验证集。
- 不要覆盖、回退或清理用户未创建的工作区改动。
- 新任务必须基于最新 `upstream/dev` 创建独立的 `fix/*` 或 `feature/*` 分支；继续原任务时保留原分支。
- 未经用户明确要求，不自动提交、推送、创建 PR、评论认领 Issue 或修改远程状态。

## 当前快照

- 集成基线：`upstream/dev`，记录版本见 `.claude/PROJECT_CONTEXT.md`。
- 当前仓库是 GoNavi-Wails，桌面端使用 Wails，前端使用 React/Vite。
- 当前本机环境和已验证工具见 `.claude/LOCAL_ENVIRONMENT.md`，不要把其中路径复制进项目代码。

## 常用命令

```powershell
wails dev
node tools/wails-fast-dev.mjs
go test ./... -count=1 -timeout=30m
npm --prefix frontend test
npm --prefix frontend run build
```

人工进行最终构建并打开应用：

```powershell
& .\.claude\scripts\build-and-run.ps1
```

该脚本只存于本地忽略目录；默认会先关闭同路径的旧 `GoNavi.exe`，构建完成后启动新产物。可用 `-NoLaunch` 跳过启动，或用 `-KeepExisting` 禁止脚本自动关闭旧实例。

提交前检查：

```powershell
git diff --cached --name-status
git diff --cached --check
```

详细的任务生命周期见 `.claude/TASK_WORKFLOW.md`，依赖、测试分层和构建说明见 `.claude/DEVELOPMENT.md`。
