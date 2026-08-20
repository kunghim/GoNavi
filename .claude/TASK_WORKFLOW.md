# GoNavi 任务生命周期规范

本规范依据仓库 `CONTRIBUTING.zh-CN.md` 和共建说明 Issue #671 制定。任务边界比会话边界更重要：新会话不代表新任务，同一会话也可能开始另一个任务。

## 一、先判断当前状态

开始任何开发前运行：

```powershell
git status --short --branch
git remote -v
```

按以下规则判断：

| 状态 | 操作 |
| --- | --- |
| 新会话继续原任务 | 保留原功能分支，检查已有 diff 和测试记录后继续，不创建新分支 |
| 新会话开始新任务 | 确认工作区干净，执行“新任务启动流程” |
| 同一会话切换到新需求 | 先完成或明确暂停旧任务；未提交改动不得带入新分支 |
| 当前分支或改动来源不明 | 停止切换，阅读日志和 diff；不能自行 stash、reset、rebase 或丢弃 |

如果用户的新消息只是补充当前需求，不应当创建新分支。如果需求目标、Issue 或交付范围已经改变，应视为新任务。

## 二、Issue 认领与需求确认

开发已有 Issue 前：

1. 阅读 Issue 正文、维护者评论、关联 PR 和验收要求。
2. 确认 Issue 没有被其他贡献者认领。
3. 需要认领时，在 Issue 评论 `/claim` 或“我想做”；这是外部写操作，只有用户明确要求时才代为执行。
4. 同一时间优先完成一个已认领任务，不并行抢占多个 Issue。
5. 大改动、新架构或需求边界不清时，先开 Issue 或 Draft PR 对齐方案。

Bug 任务必须先在最新 `dev` 上复现。无法复现时记录环境、步骤和证据，不得为了提交 PR 强行改代码。

## 三、新任务启动流程

前提：工作区干净，旧任务已提交并推送、明确暂停在原分支，或根本没有旧任务。

```powershell
# 更新官方仓库和 Fork 的远程引用
git fetch upstream --prune
git fetch origin --prune

# 直接以官方 dev 创建独立任务分支
git switch -c fix/<issue-or-topic> upstream/dev
# 或
git switch -c feature/<issue-or-topic> upstream/dev
```

约束：

- `upstream` 指向 `Syngnat/GoNavi`，`origin` 指向个人 Fork。
- 本地 `dev` 可包含用于跨设备同步的个人开发工具提交，不是产品任务的派生基线。必须从最新 `upstream/dev` 创建分支，不能直接从本地 `dev`、`main` 或旧功能分支派生。
- 如需将上游更新同步到本地 `dev`，先检查 `git log --left-right dev...upstream/dev` 和冲突范围，再由用户确认执行 merge；禁止自动 reset、强制覆盖或 rebase。同步后的 `git push origin dev` 只更新个人 Fork。
- `git push origin dev` 和创建远程分支需要用户明确授权；只做本地开发时可以暂不推送。
- 分支名使用 `fix/*` 或 `feature/*`，建议包含 Issue 编号和简短主题。

## 四、继续已有任务

继续任务时不重复创建分支：

```powershell
git status --short --branch
git log --oneline --decorate -8
git diff --stat
git fetch upstream --prune
git rev-list --left-right --count HEAD...upstream/dev
```

如果上游 `dev` 有新提交，只评估它是否影响当前任务。不要在存在未提交改动时自动 merge/rebase；需要同步功能分支时先说明风险和冲突范围。

## 五、开发与验证原则

- 一个 PR 只解决一类问题，保持最小可合并范围。
- 先阅读相关实现和现有测试，再做修改。
- Bug 修复优先补可重复回归测试，不依赖真实付费 Key 或不可控外部服务。
- 保持通用兼容性，除非协议明确要求，不针对特定域名或单一环境硬编码。
- 不做无关重构、全仓格式化或顺手修改。
- API Key、Authorization、自定义敏感 Header、代理凭证、真实连接串、业务数据不得进入代码、测试、日志、截图、Issue 或 Git 历史。
- UI 改动应验证主要桌面尺寸，提交 PR 时尽量附修复前后截图或录屏。

## 六、任务完成与提交前检查

先运行与风险匹配的测试，再检查所有变更：

```powershell
git status --short
git diff --stat
git diff --check
git diff --name-only upstream/dev...HEAD
```

明确暂存代码和测试文件，不使用无审查的全量暂存：

```powershell
git add <明确文件列表>
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
```

必须确认暂存区不包含：

- `AGENTS.md`、`CLAUDE.md`、`.claude/` 或 AI 过程资料
- 密钥、连接串、隐私数据、调试输出和临时文件
- 与当前需求无关的代码、文档或格式化

提交信息推荐格式：

```text
emoji type(scope): 中文描述
```

只有用户明确要求后才执行 `git commit` 和 `git push -u origin <branch>`。

## 七、PR 规范

- PR base 必须选择上游 `Syngnat/GoNavi:dev`，不能直接提交到 `main`。
- 除非用户或维护者明确指定其他语言，标题、正文、评论和面向维护者的说明一律使用中文；标题推荐格式为 `emoji type(scope): 中文描述`，且必须与实际改动和关联 Issue 一致。
- 不得使用无意义的英文、机器生成的泛化标题，或不相关的 Issue 编号。
- 正文至少包含：背景与问题、变更点、影响与风险、验证方式；关联 Issue 时末尾使用 `Closes #编号`。
- 只记录实际执行过的测试、构建或人工验证；未执行的项目不能写成已通过。
- 正文必须是实际 Markdown 段落和列表，不能出现字面量 `\n`、`\t` 等转义字符。命令行创建 PR 时优先使用 UTF-8 正文文件，例如 `gh pr create --body-file pr.md`；PowerShell 双引号字符串不会将 `\n` 转换成换行。
- 涉及兼容性、数据或构建链路时补充风险与回滚方式。
- UI 改动尽量附截图或录屏。
- 创建 PR 前确认基于最新 `dev`、关键路径已验证、没有无关格式化。
- 涉及 UI 或交互改动时，创建 PR 前必须启动可供用户访问的浏览器/应用预览，并明确交给用户进行人工测试；自动化测试、构建成功或此前的测试记录不能替代这一步。
- 必须等待用户在当前需求中明确说“可以提交 PR”或给出等价的主动授权；“测试通过”只表示验证完成，不代表允许提交、推送或创建 PR。没有这条明确授权时，不得执行这些外部写操作。
- 创建 PR 是外部写操作，只有满足上述人工测试和明确授权条件后才执行。
- 创建或更新 PR 后，必须从 GitHub 回读标题、正文、源/目标分支、提交数、文件列表和 Issue 关联；本地命令显示成功不能替代该核验。
- 回读时确认中文内容实际分段、标题和正文与改动一致、分支和文件范围正确、验证记录真实。发现错误时，先修正远端并再次回读，再通知用户或请求评审。

## 八、开始下一个任务

PR 创建或旧任务明确暂停后，开始新需求时重新执行状态检查和“新任务启动流程”。不要在旧功能分支上继续开发另一个 Issue，也不要把旧任务未提交改动带入新分支。
