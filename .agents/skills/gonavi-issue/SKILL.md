---
name: gonavi-issue
description: 根据 gonavi-scan 报告或用户指定的 GoNavi 问题生成、审查并在人工确认后提交 GitHub Issue；支持已验证、代码证据和待验证问题，自动查重并回读确认创建结果。
---

# GoNavi Issue 提交

将扫描发现转成可维护、可复现、可验收的 GitHub Issue。默认目标仓库是 `Syngnat/GoNavi`；当前工作树的 `origin` 可能是个人 fork，不能据此猜测 Issue 目标。

## 安全边界

- 只有用户明确确认提交时，才执行 `scripts/submit_issue.ps1 -Confirm`。
- 未确认时只生成草稿或执行 `-DryRun`，不得调用创建接口。
- 正文和命令中不得出现密码、Token、完整连接串、私钥或未经脱敏的业务数据。
- 提交失败或回读校验失败时，不得标记为已提交。

## 工作流

1. 先检查用户是否明确提供发现 ID。未提供时，只读取 `.agents/findings.yaml`，运行 `scripts/list_submit_candidates.ps1` 列出 `issue_url` 为空的活跃发现（`ID + 标题 + 验证状态`），让用户选择；此时不生成草稿、不执行查重，也不调用提交脚本。已有 `issue_url` 的发现视为已提交，不重复创建。
2. 用户提供 ID 后，读取该发现及其证据报告；不存在、已归档或已有 `issue_url` 时停止。
3. 判断类型：Bug 使用 `bug` 标签，需求使用 `enhancement` 标签。所有由本 skill 提交的 Issue 额外使用 `ai-discovered` 标签，用于区分 AI 扫描发现与人工提交；不创建验证状态标签。
4. 保留发现原有验证状态：`已验证`、`代码证据未运行时验证` 或 `待验证`。验证状态写在正文，不得把未验证推断写成已复现。
5. 查重：使用目标仓库的 `gh issue list --state all --search`。发现 ID 命中时停止提交；功能名和关键结论命中时仅作为相似 Issue 提示，由用户在确认前判断是否重复。清单中的 `issue_url` 是本地提交状态，远端查重是第二道防线。
6. 根据清单字段直接在内存中生成正文。不得创建或维护 `drafts/` 文件。Bug 和需求分别保留对应的证据、影响、建议和验收标准。
7. 使用显式 `-FindingId` 先以 `-DryRun` 检查并展示正文；获得明确确认后再加 `-Confirm` 执行。
8. 创建成功后立即用 `gh issue view` 回读 `number`、`title`、`state`、`labels` 和正文标记；仅当目标仓库、标题、类型标签和 `ai-discovered` 标签均匹配时报告成功。
9. 将 Issue URL 回写到 `.agents/findings.yaml` 对应发现的 `issue_url`；报告只作为证据来源，不作为提交状态的唯一来源。不得修改业务代码。

## 提交脚本

未提供发现 ID 时，先运行 [scripts/list_submit_candidates.ps1](scripts/list_submit_candidates.ps1)；它只输出可提交的 `ID + 标题 + 验证状态`。使用 [scripts/submit_issue.ps1](scripts/submit_issue.ps1) 时必须显式传入 `-FindingId`，正文由清单字段直接生成，不写入草稿文件。提交脚本默认只做预检，只有显式传入 `-Confirm` 才会创建 Issue；默认目标是 `Syngnat/GoNavi`，需要其他目标时必须显式传入 `-Repo`。
