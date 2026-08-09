# SQL 查询与治理

> scan_id: `state-migration-20260809`
> head_commit: `1de297628effe5e79cd756f83ee850744abd9537`

> 本文件是 gonavi-scan 功能地图的领域分册。能力 ID 保持稳定；扫描时只更新受影响领域。

### CAP-QUERY-001 上下文 SQL 编辑器

- 用户任务：在多标签工作台编写、保存和复用 SQL。
- 功能入口：查询标签、对象右键查询模板、保存查询分组。
- 主流程：新建查询 -> 获得库表字段补全 -> 编辑/选择语句 -> 保存或执行。
- 子功能：Monaco 编辑器、字段拖拽插入、库表字段上下文、外部 SQL 文件、标签重命名、保存查询分组、AI 生成/解释/优化。
- 异常流程：连接切换、SQL 文件保存失败、上下文加载失败。
- 证据：`frontend/src/components/QueryEditor.tsx`、`QueryEditor.results-and-drop.test.tsx`、`QueryEditor.external-sql-save.test.tsx`、`frontend/src/utils/savedQueryPersistence.ts`。

### CAP-QUERY-002 查询执行、取消与事务控制

- 用户任务：安全执行 SQL，并控制耗时查询与事务边界。
- 主流程：选择执行范围 -> 提交查询 -> 查看进度/消息 -> 获取结果或取消 -> 提交/回滚事务。
- 子功能：选区/当前语句执行、超时、取消、批次消息、只读判断、事务设置和重载。
- 异常流程：超时、取消竞争、连接断开、事务提交/回滚失败、危险写操作。
- 证据：`frontend/src/components/QueryEditorToolbar.tsx`、`QueryEditorTransactionToolbar.tsx`、`internal/app/methods_db_cancel_test.go`、`methods_db_timeout_test.go`、`methods_db_transaction.go`。


### SQL 查询与治理

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-QUERY-A01 | 新建、重命名和关闭查询标签 | 标题栏/快捷键/对象菜单 → 查询标签 | 背景任务关闭保护 | 已实现 | `TabManager.tsx` |
| CAP-QUERY-A02 | 标签最近记录、排序和批量关闭 | 标签栏 → 拖动/菜单 | 自适应宽度和悬停详情 | 已实现 | `TabManager.recent.test.ts`；`TabManager.adaptive-width.test.ts` |
| CAP-QUERY-A03 | 分离查询或工作台窗口 | 拖出标签/分离动作 → 独立窗口 | 父子窗口生命周期与重新停靠 | 已实现 | `FloatingQueryResultWindows.tsx`；`internal/nativewindow` |
| CAP-QUERY-A04 | Monaco SQL 编辑 | 查询标签 → 输入 SQL | IME、滚动、Worker、主题和字体 | 已实现 | `QueryEditor.tsx`；`MonacoEditor.tsx` |
| CAP-QUERY-A05 | 库表字段上下文补全 | 选择连接/库 → 输入对象名 → 接受提示 | 元数据失败时退化 | 已实现 | `DBGetAllColumns`；`QueryEditor.tsx` |
| CAP-QUERY-A06 | 拖入表或结果列生成 SQL | 从侧栏/列头拖入编辑器 → 落点预览 → 插入 | 覆盖 SELECT、INSERT、UPDATE 和重复字段 | 已实现 | `sqlFieldDrop.ts`；`QueryEditor.results-and-drop.test.tsx` |
| CAP-QUERY-A07 | 保存查询和分组 | 查询菜单 → 保存 → 新建/移动分组 | 支持嵌套分组 | 已实现 | `methods_saved_queries.go` |
| CAP-QUERY-A08 | 查询重绑定和未绑定恢复 | 保存查询 → 更换/缺失连接 → 重绑定 | 连接删除后仍可找回 SQL | 已实现 | `RebindSavedQuery`；`GetUnboundSavedQueries` |
| CAP-QUERY-A09 | 外部 SQL 文件和目录 CRUD | SQL 文件树 → 新建/读写/改名/删除 | Web/桌面文件系统能力不同 | 已实现 | `methods_file.go`；`QueryEditor.external-sql-save.test.tsx` |
| CAP-QUERY-A10 | 执行选区、当前语句或全部 SQL | 工具栏/快捷键 → 选择范围 → 执行 | SQL 拆句和方言差异 | 已实现 | `QueryEditorToolbar.tsx` |
| CAP-QUERY-A11 | 多结果集与批次消息 | 执行多语句 → 切换结果/查看消息 | Driver Agent 不支持时回退 | 已实现 | `DBQueryMulti`；`optional_driver_agent_impl.go` |
| CAP-QUERY-A12 | 取消和超时 | 查询运行中 → 取消；设置超时 → 自动终止 | 处理取消竞争和连接释放 | 已实现 | `methods_db_cancel_test.go`；`methods_db_timeout_test.go` |
| CAP-QUERY-A13 | 显式事务提交和回滚 | 事务模式 → 执行 → 提交/回滚 | 消息、缓存和时序类数据源不支持 | 部分实现 | `QueryEditorTransactionToolbar.tsx`；`methods_db_transaction.go` |
| CAP-QUERY-A14 | SQL 文件批量执行和取消 | SQL 文件 → 执行工作台 → 运行/取消 | 流式拆句、作业 ID 和错误定位 | 已实现 | `SQLFileExecutionWorkbench.tsx`；`ExecuteSQLFile` |
| CAP-QUERY-A15 | 查询日志和慢查询 | 日志/慢查询面板 → 筛选/排序/清理 | 慢查询采集能力按数据源变化 | 已实现 | `LogPanel.tsx`；`SlowQueryPanel.tsx` |
| CAP-QUERY-A16 | Explain 计划图和诊断建议 | SQL 分析 → Explain → 图/侧栏 | 多方言解析器，未知计划退化 | 已实现 | `frontend/src/components/explain`；`methods_explain.go` |
| CAP-AUDIT-A01 | SQL 审计筛选和详情 | 工具 → SQL 审计 → 筛选/查看 | 记录执行状态、耗时与上下文 | 已实现 | `SqlAuditWorkbench.tsx`；`methods_sql_audit.go` |
| CAP-AUDIT-A02 | 审计脱敏、保留和健康告警 | 审计设置 → 策略 → 保存/检查 | 本地存储损坏或完整性失败会提示 | 已实现 | `internal/sqlaudit`；`SqlAuditHealthAlert.tsx` |
| CAP-AUDIT-A03 | 审计完整性校验、清理和导出 | 审计工具 → 校验/清理/导出 | 支持格式和时间范围筛选 | 已实现 | `VerifySQLAuditIntegrity`；`BuildSQLAuditExport` |
