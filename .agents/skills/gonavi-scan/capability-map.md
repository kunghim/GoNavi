# GoNavi 功能地图

> 基线提交：`0acc9bdbd0300679ccb632f8a649b62095136f56`。本地图由 `gonavi-scan` 维护；“本次范围内未找到实现证据”不代表功能不存在。

## 功能总览

| 功能 ID | 产品领域 | 功能模块 | 具体能力 | 当前状态 |
|---|---|---|---|---|
| CAP-CONN-001 | 数据连接 | 连接管理 | 创建、测试、保存和组织连接 | 已实现 |
| CAP-CONN-002 | 数据连接 | 网络与凭据 | SSH、TLS、代理和凭据保护 | 已实现 |
| CAP-CONN-003 | 数据连接 | 驱动体系 | 内置与可选 Driver Agent 数据源 | 已实现 |
| CAP-EXP-001 | 对象浏览 | 数据库资源树 | 库、Schema、表和对象元数据浏览 | 已实现 |
| CAP-QUERY-001 | 查询工作台 | SQL 编辑器 | 上下文补全、保存和多标签编辑 | 已实现 |
| CAP-QUERY-002 | 查询工作台 | 查询执行 | 执行、取消、超时和事务控制 | 已实现 |
| CAP-DATA-001 | 数据操作 | 结果与表数据 | 大结果集浏览、编辑和批量提交 | 已实现 |
| CAP-DATA-002 | 数据交换 | 导入导出 | 表数据、查询结果和数据库导入导出 | 已实现 |
| CAP-DESIGN-001 | 对象设计 | 表与对象管理 | 表结构设计、DDL 预览和对象定义 | 已实现 |
| CAP-SYNC-001 | 数据迁移 | 数据同步 | 结构同步、直接导入和差异同步 | 部分实现 |
| CAP-ANALYZE-001 | SQL 治理 | 分析与审计 | Explain、慢查询、执行日志和审计中心 | 已实现 |
| CAP-REDIS-001 | 专用工作台 | Redis | Key 浏览、命令、监控和多类型编辑 | 已实现 |
| CAP-ES-001 | 专用工作台 | Elasticsearch | 索引、Mapping、查询和受控 REST 控制台 | 已实现 |
| CAP-AI-001 | AI 助手 | 数据库上下文 AI | 多模型对话、结构上下文和数据库工具 | 已实现 |
| CAP-MCP-001 | Agent 集成 | MCP | 本地/远程 MCP 服务和客户端安装引导 | 已实现 |
| CAP-WEB-001 | 运行模式 | Web Server | 浏览器访问、认证和容器部署 | 已实现 |
| CAP-JVM-001 | 运维工具 | JVM | 监控、诊断、变更预览和审计 | 已实现 |
| CAP-NACOS-001 | 运维工具 | Nacos | 配置、服务、监听和传输 | 已实现 |
| CAP-OPS-001 | 平台能力 | 备份与辅助 | 云备份、结果差异、代理和多窗口 | 已实现 |

## 功能详情

### CAP-CONN-001 创建、测试、保存和组织连接

- 目标用户：开发人员、DB 工程师。
- 使用场景：接入本地、测试或生产数据源并进入工作台。
- 功能入口：连接侧栏与连接编辑弹窗。
- 主流程：选择数据源 -> 填写连接参数 -> 测试 -> 保存 -> 打开资源树或工作台。
- 子功能：连接分组、环境标记、URI 解析/生成、只读连接、数据库可见范围、连接配置导入导出。
- 关联对象：保存连接、连接参数、数据库会话。
- 异常流程：认证失败、网络不可达、驱动缺失、参数不兼容、连接超时。
- 证据：`frontend/src/components/ConnectionModal.tsx`、`frontend/src/components/SidebarConnectionGroupNewConnection.test.tsx`、`internal/app/methods_saved_connections.go`、`internal/connection/types.go`。
- 已知限制：具体参数能力随数据源和驱动模式不同。

### CAP-CONN-002 SSH、TLS、代理和凭据保护

- 用户目标：在不暴露明文凭据的情况下连接隔离网络或受 TLS 保护的数据源。
- 主流程：配置网络安全选项 -> 测试隧道/代理/TLS -> 解析凭据 -> 建立连接。
- 子功能：SSH 密钥、SSH 转发复用、全局代理、数据库范围代理、TLS 模式、系统密钥环、每日密钥迁移。
- 异常流程：密钥不可读、隧道中断、证书错误、代理不可达、密钥环不可用。
- 证据：`frontend/src/components/connectionModal/ConnectionModalNetworkSecuritySection.tsx`、`internal/ssh/ssh.go`、`internal/tlsconfig/tlsconfig.go`、`internal/proxy/proxy.go`、`internal/secretstore/store.go`、`internal/app/connection_secret_resolution.go`。

### CAP-CONN-003 内置与可选 Driver Agent 数据源

- 用户目标：用统一工作台连接关系型、缓存、消息、向量、搜索和时序数据源。
- 支持范围：README 声明内置 MySQL、PostgreSQL、Oracle、Redis、Chroma、Qdrant、Milvus、RocketMQ、MQTT、Kafka、RabbitMQ 等；可选 Driver Agent 扩展 SQL Server、SQLite、DuckDB、OceanBase、Dameng、ClickHouse、MongoDB、TDengine、IoTDB、Trino、Elasticsearch 等。
- 主流程：识别驱动模式 -> 检查或安装代理 -> 启动代理 -> 通过统一数据库接口查询和浏览元数据。
- 子功能：Custom Driver、DSN、可选代理二进制检查、流式查询协议、构建时 lite/full 能力差异。
- 异常流程：平台不支持、代理缺失、协议不兼容、驱动错误。
- 证据：`README.zh-CN.md`“支持的数据源”、`internal/db/driver_support.go`、`internal/db/optional_driver_agent_impl.go`、`cmd/optional-driver-agent`。

### CAP-EXP-001 数据库资源树与对象元数据

- 用户任务：按连接浏览数据库、Schema、表、视图、序列、触发器和其他对象。
- 主流程：选择连接 -> 加载库/Schema -> 展开对象 -> 查看定义、列、索引或数据。
- 子功能：元数据缓存/重试、对象定义、表行数近似值、全库定位、数据源特定对象。
- 异常流程：权限不足、元数据查询失败、同名/带点对象、连接切换。
- 证据：`frontend/src/components/Sidebar.tsx`、`frontend/src/components/FindInDatabaseModal.tsx`、`internal/app/methods_db_objects.go`、`internal/app/methods_db_metadata_retry_test.go`。

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

### CAP-DATA-001 大结果集浏览与表数据编辑

- 用户任务：浏览查询/表数据，编辑单元格并批量提交变更。
- 主流程：加载分页结果 -> 虚拟滚动/筛选/查找 -> 编辑或增删行 -> 预览危险变更 -> 提交或回滚。
- 子功能：DataGrid、分页、列快速查找、记录视图、大字段预览、复制、批量增删改、主键定位、DDL/ER 视图。
- 异常流程：无主键、只读结果、并发数据变化、大字段、提交部分失败。
- 证据：`frontend/src/components/DataGrid.tsx`、`DataViewer.tsx`、`useDataGridBatchActions.ts`、`tableDataDangerActions.ts`、`internal/db/change_preview.go`、`batch_insert.go`。

### CAP-DATA-002 数据与连接导入导出

- 用户任务：导入外部数据，或导出表、查询结果、DDL 和连接配置。
- 支持范围：CSV、XLSX、JSON、Markdown 结果导出；数据库/表导入工作台；SQL 导出；连接包导入导出。
- 主流程：选择来源/目标 -> 预览映射与选项 -> 执行 -> 查看进度/错误 -> 获取产物。
- 子功能：后台导出进度、列选择、预览、连接包加密。
- 异常流程：格式错误、字段映射失败、目标约束冲突、取消、部分写入。
- 证据：`DataImportWorkbench.tsx`、`TableExportWorkbench.tsx`、`DataExportDialog.tsx`、`SQLExportOptionsDialog.tsx`、`internal/app/connection_package_transfer.go`。

### CAP-DESIGN-001 表结构设计与对象定义

- 用户任务：创建或修改表结构并在执行前检查 DDL。
- 主流程：加载现有结构或新建 -> 编辑列/键/索引 -> 生成 SQL 预览 -> 执行 -> 刷新元数据。
- 子功能：表概览、DDL 工作区、对象定义查看、不同数据源 SQL 生成。
- 异常流程：不兼容类型、约束冲突、方言差异、执行后刷新失败。
- 证据：`frontend/src/components/TableDesigner.tsx`、`TableDesignerSqlPreview.tsx`、`TableOverview.tsx`、`internal/app/methods_db_create_statement_test.go`。

### CAP-SYNC-001 结构与数据同步

- 用户任务：在两个数据源之间分析差异、迁移结构并同步数据。
- 主流程：选择源/目标与入口模式 -> 分析兼容性 -> 预览 -> 选择表/行与策略 -> 执行 -> 查看日志和结果。
- 子功能：Schema 对齐、直接导入、分页读取、差异同步、SQL 结果同步、MongoDB/Redis/ClickHouse/TDengine 特殊迁移、后台任务。
- 当前状态：部分实现。
- 已知限制：差异同步要求单列主键；无主键或复合主键会被拒绝或跳过。
- 证据：`DataSyncWorkbench.tsx`、`internal/sync/analyze.go`、`sync_engine.go`、`diff_paging.go`、`schema_migration.go`。

### CAP-ANALYZE-001 SQL 分析、慢查询与审计

- 用户任务：理解执行计划、定位慢查询并追溯数据库操作。
- 主流程：选择 SQL/日志 -> 执行 Explain 或查看审计记录 -> 分析耗时与风险 -> 导出或调整策略。
- 子功能：多方言 Explain 解析、慢查询面板、SQL 执行耗时日志、脱敏、保留策略、健康提示和审计导出。
- 异常流程：方言不支持、计划解析失败、审计存储不可用。
- 证据：`frontend/src/components/explain/SlowQueryPanel.tsx`、`audit/SqlAuditWorkbench.tsx`、`internal/app/methods_explain.go`、`internal/sqlaudit`。

### CAP-REDIS-001 Redis 专用工作台

- 用户任务：浏览 Key、编辑多种 Redis 值、执行命令并查看监控。
- 主流程：选择 Redis 连接 -> 浏览/搜索 Key -> 查看或编辑值/TTL -> 执行命令 -> 查看监控。
- 子功能：编码/视图切换、String/Hash/List/Set/ZSet/Stream 等值类型、命令编辑器、轮询监控。
- 证据：`RedisViewer.tsx`、`RedisCommandEditor.tsx`、`RedisMonitor.tsx`、`internal/redis/redis.go`、`internal/app/methods_redis.go`。

### CAP-ES-001 Elasticsearch 工作台与受控控制台

- 用户任务：浏览索引和 Mapping，执行 JSON DSL、query_string 或受控 REST 请求。
- 子功能：索引/Mapping/Settings/Alias、健康和有限 CAT API、Dev Tools 风格批次、NDJSON `_bulk`/`_msearch`。
- 安全边界：后端白名单拒绝未知或高权限端点。
- 证据：`README.zh-CN.md`“Elasticsearch REST 控制台”、`QueryEditorToolbar.elasticsearch.test.tsx`、`internal/esconsole/policy.go`、`internal/db/elasticsearch_impl.go`。

### CAP-AI-001 数据库上下文 AI 助手

- 用户任务：结合当前连接和表结构生成、解释、优化 SQL，或分析数据库问题。
- 主流程：配置 Provider -> 选择上下文/工具 -> 对话或快捷指令 -> 流式输出 -> 应用结果。
- 子功能：OpenAI、Gemini、Claude、兼容 API 和 CLI Provider；会话历史、附件、上下文预览、本地数据库工具、安全分类和流取消。
- 异常流程：Provider 配置失败、上下文过大、工具执行失败、敏感操作拦截。
- 证据：`AIChatPanel.tsx`、`AISettingsModal.tsx`、`frontend/src/components/ai`、`internal/ai/context`、`internal/ai/provider`、`internal/ai/safety`。

### CAP-MCP-001 MCP 服务与 Agent 接入

- 用户任务：让 Claude Code、Codex 或远端 Agent 在凭据留在本机的前提下使用数据库能力。
- 主流程：启用 MCP -> 选择客户端或 HTTP 模式 -> 生成/安装配置 -> 校验状态 -> 调用工具。
- 子功能：客户端安装引导、Server 配置表单、HTTP 服务、Docker、远程快速开始、工具 Schema 提示。
- 证据：`README.zh-CN.md`“MCP & Agents”、`frontend/src/components/ai/AIMCP*`、`internal/mcpserver`、`internal/ai/service/mcp_http_server.go`、`cmd/gonavi-mcp-server`。

### CAP-WEB-001 Web Server 与容器运行

- 用户任务：不依赖桌面 WebView，通过浏览器访问 GoNavi 工作台。
- 主流程：启动 Web Server -> 完成密码认证 -> 浏览器加载前端 -> 通过运行时桥调用后端。
- 子功能：认证页面、客户端 IP 判断、运行时桥、Docker/Podman/K8s/Helm 部署材料。
- 已知限制：README 标记为实验性；公网暴露需要反向代理与 HTTPS。
- 证据：`README.zh-CN.md`“Web Server”、`frontend/src/components/WebAuthSettingsPanel.tsx`、`internal/webserver`。

### CAP-JVM-001 JVM 监控与诊断

- 用户任务：连接 JVM，查看运行状态，执行受控诊断并保留审计记录。
- 子功能：JMX/HTTP/Agent Provider、监控仪表盘、资源浏览、诊断控制台、命令预设、变更预览、输出脱敏、诊断审计。
- 异常流程：目标不可达、Agent/JMX 不可用、诊断命令失败、敏感输出。
- 证据：`frontend/src/components/JVM*`、`frontend/src/components/jvm`、`internal/jvm`、`internal/app/methods_jvm*.go`。

### CAP-NACOS-001 Nacos 配置与服务管理

- 用户任务：浏览命名空间、配置和服务，监听变化并执行配置传输。
- 子功能：认证生命周期、API 版本适配、配置监听、服务实例、Beta 发布/传输、缓存。
- 异常流程：认证过期、监听竞争、版本不兼容、传输失败。
- 证据：`NacosViewer.tsx`、`NacosServiceViewer.tsx`、`internal/nacos`、`internal/app/methods_nacos*.go`。

### CAP-OPS-001 备份、差异和桌面辅助能力

- 用户任务：备份/恢复本地配置、比较数据结果，并组织桌面工作区。
- 子功能：加密云备份与远端预览、分类恢复、结果差异会话、全局代理、浮动/原生分离窗口、更新检查。
- 异常流程：远端不可用、解密失败、恢复冲突、子窗口异常退出。
- 证据：`CloudBackupSettings.tsx`、`CloudBackupRestoreDialog.tsx`、`frontend/src/components/resultDiff`、`internal/cloudbackup`、`internal/resultdiff`、`NativeDetachedWindowController.test.ts`。

## 本次未展开范围

- 各数据源方言的全部对象类型与每个驱动的逐项能力差异。
- Kafka、MQTT、RabbitMQ、RocketMQ、Chroma、Qdrant、Milvus 等专用工作台的完整用户流程。
- 发布、自动更新和各操作系统安装维护的详细子能力。
