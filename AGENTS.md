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

## 本地 dev 与功能分支

- 本地 `dev` 可用于在个人设备之间同步本机开发辅助工具（例如 `.agents/` 下的 skill）；因此它可以包含不属于上游产品的个人提交，并可能落后或分叉于 `upstream/dev`。
- `upstream/dev` 始终是产品代码的真实集成基线。开始新的产品任务时，先 `git fetch upstream --prune`，再直接从最新 `upstream/dev` 创建 `fix/*` 或 `feature/*` 分支，不从含本地工具提交的 `dev` 派生。
- 将 `upstream/dev` 合并进本地 `dev` 会保留本地提交，并带来全部上游更新；仅在确认冲突和差异后进行。同步后推送到 `origin/dev` 仅更新个人 Fork，不会自动影响已存在或后续 PR。
- 不得把本地工具、`AGENTS.md`、`.claude/` 或其他个人辅助提交带入产品功能分支和上游 PR。

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
---

# GoNavi 编码规约

本文件是 GoNavi 的**规约索引与跨语言硬约束**。Cursor、Claude Code、Codex 及其他能读取仓库提示词的 AI 都必须遵守。语言专属手册以链接为准，不要另写一套。

配套入口：

- `CLAUDE.md` → Claude Code
- `.cursor/rules/*.mdc` → Cursor（按文件类型自动附加）
- 本文件 → Codex / Cursor / 通用 Agent
- [`GO_STYLE.md`](./GO_STYLE.md) → **Go 专属手册**（改 `*.go` 时必读）
- [`GO_STYLE.md`](./GO_STYLE.md) → **Go 专属手册**（改 `*.go` 时必读）

标记含义与《阿里巴巴 Java 开发手册》一致：**【强制】** 必须执行，**【推荐】** 默认执行，**【参考】** 有充分理由才可偏离。

---

## 0. 项目是什么

GoNavi 是 **Wails v2 + Go + React 18** 的跨平台数据源工作台，不是 Electron 应用，也不是普通前后端分离 Web。

| 层 | 位置 | 职责 |
|---|---|---|
| 桌面壳 | `main.go` | Wails 启动、窗口、菜单 |
| Wails 绑定 | `internal/app` | 给前端/MCP/Web RPC 的 `App` 方法，保持薄 |
| 领域实现 | `internal/db`、`internal/ai`、`internal/sync`、`internal/connection` 等 | 驱动、AI、同步、类型 |
| UI | `frontend/src` | React + Ant Design 5 + Zustand + Monaco |
| 文案 | `shared/i18n/*.json` | 前后端共用目录 |
| 生成物 | `frontend/wailsjs/` | **禁止手改** |
| Go 手册 | [`GO_STYLE.md`](./GO_STYLE.md) | **Go 专属规约**（Uber + Google + Effective Go + 本仓库） |
| Java | `tools/jmx-helper`、`internal/jvm/testdata` | 小工具/夹具，跟《阿里巴巴 Java 开发手册》 |

Go module：`GoNavi-Wails`。默认集成分支：`dev`。

---

## 1. 【强制】体积与拆分（本仓库最高优先级）

当前债务（禁止继续加行）：`frontend/src/components/QueryEditor.tsx`、`App.tsx`、`store.ts`、`DataGrid.tsx`、`Sidebar.tsx`、`queryEditor/QueryEditorHelpers.ts`、`internal/app/methods_file.go`、`methods_db.go`、`app.go`。

正确范例：`DataGridShell` / `DataGridCore` / `DataGridModals` 拆文件；`components/queryEditor/`、`components/sidebar/`、`components/ai/` 拆目录；Go 侧 `methods_db_objects.go`、`methods_db_transaction.go`、`application_icon_windows.go`。

### 1.1 限额

| 对象 | 【强制】上限 | 【推荐】 |
|---|---|---|
| 新建生产源文件 | 800 行 | 400 行 |
| 存量超标文件 | **禁止净增加行数** | 每次改动都拆走一块 |
| 函数 / 组件函数体 | 120 行 | 80 行 |
| 测试文件 | 1500 行 | 按场景拆成多个 `*.test.ts(x)` / `*_test.go` |
| `frontend/wailsjs/**` | 0 行手改 | 走 Wails 生成 |

### 1.2 拆分原则

1. **能拆包拆包，能拆类拆类，能拆 hook 拆 hook。** 不要用「先写在一个文件里以后再拆」作为默认。
2. 一个文件只承担一个主题：一种驱动能力、一种 UI 面板、一组绑定方法、一个 hook。
3. 触碰超标文件时，必须把本次改动抽到新文件；允许的最小动作是「新逻辑写在新文件，旧文件只留 re-export / 接线」。
4. 禁止为了过限额做无意义换行、把逻辑藏进巨型字符串、或把测试和实现揉进同一生产文件。

```text
❌ QueryEditor.tsx 再加 200 行执行逻辑
✅ queryEditor/queryEditorExecution.ts + 单测，QueryEditor.tsx 只调用

❌ methods_file.go 继续堆导入/导出
✅ methods_file_import.go / methods_file_export.go，App 方法签名不变

❌ store.ts 再加一块持久化状态
✅ store/aiChatSlice.ts（或等价拆分），根 store 只组合
```

---

## 2. 【强制】分层与依赖

1. `internal/app` 的 `App` 方法只做：参数校验、鉴权/只读策略、调领域包、把结果收成 `connection.QueryResult`。禁止在绑定层写驱动 SQL、解析协议、渲染逻辑。
2. 驱动实现放 `internal/db/*_impl.go`。公共契约是 `db.Database`；驱动特有能力用**可选接口**扩展（参考 `TableExistsChecker`、`ElasticsearchConsoleExecutor`），不要把所有方法塞进 `Database`。
3. 前端通过 `frontend/wailsjs/go/app/App` 调绑定；共享类型优先用 `frontend/src/types.ts` 与 `internal/connection`，保持 JSON 字段兼容。
4. 禁止 UI 直接拼驱动方言细节的复制粘贴；抽到 `frontend/src/utils/` 或已有 `queryEditor/`、`sidebar/` helper。
5. 禁止引入 Electron、新的状态库、新的 UI 库，除非任务明确要求。默认：React 函数组件、antd 5、Zustand、现有 `v2-theme-*.css`。
6. 平台差异用文件后缀：`*_windows.go`、`*_darwin.go`、`*_stub.go` / `*_nonwindows.go`，不要在同一函数里堆三大平台分支。

---

## 3. Go 规约

Java 跟《阿里巴巴 Java 开发手册》。**Go 不套那本手册**，专属正文是 [`GO_STYLE.md`](./GO_STYLE.md)（Uber Go Style Guide → Google Go Style / Code Review Comments → Effective Go，再叠加本仓库 Wails/驱动/i18n 条款）。改 `**/*.go` 时必须遵守该手册。

下面只列 GoNavi 叠加里最容易写错的几条；命名、并发、接口、切片、注释等以 `GO_STYLE.md` 为准。

**【强制】**

1. `internal/app` 绑定层返回 `connection.QueryResult`，失败：`Success: false` + i18n 后的 `Message`。领域层 `fmt.Errorf("...: %w", err)`，用 `errors.Is` / `errors.As`。
2. `context.Context` 第一参数，必须传到驱动查询/HTTP；连接超时 ≠ 查询超时。
3. `db.Database` 保持小，特有能力用可选接口。禁止在 `internal/app`、`internal/db` 里 `panic`。
4. 日志走 `internal/logger`，禁止密码/DSN。用户可见文案走 `shared/i18n`。
5. 文件：`methods_<领域>.go`、`<引擎>_impl.go`、`<主题>_<平台>.go`。禁止继续膨胀 `methods_file.go` / `methods_db.go` / `app.go`。
6. 单测：同包 `xxx_test.go`，表驱动，不连生产库。

---

## 4. React / TypeScript 规约

**【强制】**

1. 只用函数组件。可复用状态与副作用抽 `useXxx` hook；可复用纯函数抽 `frontend/src/utils/` 或特性目录（如 `components/queryEditor/`）。
2. 组件文件：一个主组件。子面板、toolbar、modal、layout 计算各自成文件。参考 `QueryEditorToolbar.tsx`、`queryEditorMonacoLayout.ts`，不要把它们写回 `QueryEditor.tsx`。
3. 用户可见字符串必须 `t('catalog.key')` / `useI18n()`。禁止 JSX 里写死中文/英文（单测断言、正则、品牌名除外）。目录是 `shared/i18n/*.json`，键名 `domain.feature.detail`，插值 `{{name}}`。改文案时同步所有语言文件。
4. 不要把新的全局状态塞进已经过大的 `store.ts`。新增 slice / 模块文件，根 store 只组合。
5. 禁止 `any` 作为新代码的默认类型。Wails 返回值先收敛到 `types.ts` 或局部类型。
6. 样式：工作台走 `v2-theme-*.css` 与组件旁 CSS。不要把大块布局写进 `App.css` 或组件内超长 `style={{}}`。
7. 单测用 Vitest，文件名 `*.test.ts` / `*.test.tsx`，与实现同目录。按场景拆文件（`QueryEditor.external-sql-save.test.tsx` 这种已经过大，**新用例不要往里堆**）。

**【推荐】**

- 列表/表格虚拟化、编辑器、重面板保持现有拆分方向；新增 DataGrid 能力优先新文件而不是 `DataGrid.tsx`。
- 事件名、MIME、快捷键与现有 `gonavi:` / `utils/shortcuts` 对齐。
- 修改 UI 后跑相关 Vitest；能开应用时按真实用户路径点一遍。

```tsx
// ❌ BAD
export function QueryEditor() {
  // 上万行：执行、拖拽、分页、AI、快捷键全写在这
}

// ✅ GOOD
export function QueryEditor() {
  const execution = useQueryEditorExecution(props);
  return (
    <>
      <QueryEditorToolbar {...execution.toolbar} />
      <QueryEditorMonaco {...execution.editor} />
      <QueryEditorResultsPanel {...execution.results} />
    </>
  );
}
```

---

## 5. Java 规约（Alibaba 手册在本仓库的落地）

适用范围：`tools/jmx-helper/**`、`internal/jvm/testdata/**`。完整条款遵循[阿里巴巴 Java 开发手册](https://github.com/alibaba/p3c)。这里只写本仓库会踩的。

**【强制】**

1. 类名 UpperCamelCase，方法/变量 lowerCamelCase，常量 `UPPER_SNAKE`。禁止拼音缩写。
2. 工具类 `final` + 私有构造（见 `JmxHelperMain`）。
3. 不允许未捕获的含糊 `Exception` 后空 body。Helper 的 stdout JSON 协议可以捕获后写入 `ok/error`，但必须带异常类型。
4. 魔法值抽常量。比较用 `Objects.equals`；字符串用 `StandardCharsets.UTF_8`。
5. 单个 Java 文件 ≤ 400 行，方法 ≤ 80 行。JMX 协议处理放 `JmxRuntime`，不要把 `main` 写成上帝方法。
6. 禁止在 helper 里打密码、连接串到日志。stdout 仅用于约定 JSON。

---

## 6. 安全、兼容、提交

**【强制】**

1. 不提交密钥、`.env`、私钥、生产连接密码。配置里的密码字段按现有 `secretstore` / 脱敏逻辑处理。
2. SQL 审计、只读连接、生产库确认（`productionRiskConfirm`、`connectionReadOnly`）不得绕过。
3. 不随意改 Wails 方法签名和 `QueryResult` JSON 字段；前端、MCP、Web RPC 共用这些契约。
4. 提交信息遵循 `CONTRIBUTING.md`：`emoji type(scope): 中文描述`。未要求时不要 commit、不要 push。

**【推荐】** PR 保持单一主题；UI 变更附截图或录屏说明。
