# GoNavi 本地贡献速查

> 仅供本地开发阅读。本目录和本文件均不应加入提交。

长期项目上下文见 `PROJECT_CONTEXT.md`，架构见 `ARCHITECTURE.md`，构建与测试命令见 `DEVELOPMENT.md`，任务生命周期见 `TASK_WORKFLOW.md`。Issue 处理见 `ISSUE_WORKFLOW.md`，PR 模板见 `PR_TEMPLATE.md`。本文件只保留贡献工作流摘要，不记录某一个历史任务。

- `dev` 是日常开发集成分支，`main` 是稳定发布分支，`release/*` 用于发版准备。
- 修复使用 `fix/*`，功能使用 `feature/*`；外部贡献统一向上游 `Syngnat/GoNavi:dev` 提 PR。
- 新任务先确认 Issue 未被认领；需要时评论 `/claim` 或“我想做”，一次优先完成一个任务。
- 新任务从最新 `upstream/dev` 创建独立分支；继续旧任务时保留原分支，不按会话重复建分支。
- 一个 PR 只解决一类问题，提交前检查 staged 文件，确保没有 AI 上下文、设计稿、环境记录或无关文档。
- 推荐提交格式：`emoji type(scope): 中文描述`。
- 接到 Issue 先复现、定位、评估影响面并汇报，再动手修改；分级、分阶段与子 Agent 审查见 `ISSUE_WORKFLOW.md`。
- 提交信息与 PR 标题、正文一律使用中文；每个可验证单元提交一次，每次审查后的修复再单独提交。
- PR 描述应包含背景与问题、根因、变更点、影响范围、验证方式和风险回滚；UI 改动附截图或录屏。模板见 `PR_TEMPLATE.md`。
- 完整操作顺序和异常分支处理见 `TASK_WORKFLOW.md`。
