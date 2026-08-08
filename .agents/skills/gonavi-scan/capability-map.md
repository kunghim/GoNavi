# GoNavi 功能地图

> 基线提交：`0acc9bdbd0300679ccb632f8a649b62095136f56`。本地图由 `gonavi-scan` 维护；“本次范围内未找到实现证据”不代表功能不存在。

## 覆盖账本

| 入口层 | 已枚举范围 | 映射结果 |
|---|---|---|
| 工作台与标签 | `TabData` 定义的 26 类标签/工作台 | 已映射到查询、数据、对象、Redis、Nacos、JVM、审计等能力 |
| 数据源 | README 能力矩阵的 12 个内置、21 个具名可选数据源及 Custom Driver/DSN | 34 项均有独立条目 |
| 前端操作 | 侧栏、标题栏、工具入口、设置页、菜单、右键动作和弹窗 | 已按用户可验证任务拆分 |
| 后端入口 | `internal/app` 对外方法族及 DB、同步、AI、JVM、Nacos 服务 | 已与前端入口交叉取证 |
| 独立运行面 | 桌面端、Web Server、MCP Server、Driver Agent、容器部署 | 已映射 |
| 本轮未实测 | 真实外部数据源、跨平台安装升级、Web 完整浏览器流程 | 保留为验证盲区，不声称已运行 |

## 领域索引

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

## 聚合能力说明

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

## 细粒度能力清单

以下条目用于功能核对。每项只表达一个用户可验证目标；各领域共同的目标用户、主流程和证据链由上方聚合说明补充。

### 连接与驱动

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-CONN-A01 | 新建、编辑、测试并保存连接 | 连接侧栏 → 新建/编辑 → 填参 → 测试 → 保存 | 测试失败保留编辑上下文 | 已实现 | `ConnectionModal.tsx`；`methods_saved_connections.go` |
| CAP-CONN-A02 | 复制和删除连接 | 连接菜单 → 复制/删除 | 删除前确认；复制生成独立 ID | 已实现 | `Sidebar.tsx`；`DuplicateConnection` |
| CAP-CONN-A03 | 连接分组 | 侧栏 → 新建分组/移动连接 | 支持嵌套菜单和组内新建 | 已实现 | `SidebarNestedGroupMenu.test.ts` |
| CAP-CONN-A04 | 环境标记 | 连接编辑 → 开发/测试/生产 → 保存 | 与生产危险操作保护联动 | 已实现 | `ConnectionEnvironmentSelect.tsx` |
| CAP-CONN-A05 | 只读和生产写保护 | 连接编辑 → 安全选项 → 打开保护 | 非关系型支持范围不同 | 部分实现 | `connection_readonly_test.go` |
| CAP-CONN-A06 | 限制可见数据库 | 连接编辑 → 数据库可见范围 → 保存 | 支持单库展开和隐藏范围 | 已实现 | `connectionModalDatabaseVisibility.test.ts` |
| CAP-CONN-A07 | URI/DSN 与表单互转 | 粘贴 URI → 解析 → 编辑参数 | 方言参数和文件路径按驱动处理 | 已实现 | `connectionModalUri.ts`；`dsn_test.go` |
| CAP-CONN-A08 | SSH 隧道 | 网络安全 → SSH 主机/密钥 → 测试 | RocketMQ、MongoDB SRV 等存在限制 | 部分实现 | `ConnectionModalNetworkSecuritySection.tsx`；`internal/ssh` |
| CAP-CONN-A09 | TLS/SSL 证书 | 网络安全 → TLS 模式/证书 → 测试 | 各驱动 SSL mode 映射不同 | 已实现 | `internal/tlsconfig`；`ssl_mode.go` |
| CAP-CONN-A10 | 全局与连接代理 | 设置/连接 → 代理 → 测试 → 保存 | MQTT WebSocket、RocketMQ 等存在限制 | 部分实现 | `global_proxy.go`；`internal/proxy` |
| CAP-CONN-A11 | 凭据安全存储 | 保存密码 → 密钥环/加密存储 → 使用时解析 | 密钥环不可用会显式报错 | 已实现 | `internal/secretstore`；`connection_secret_resolution.go` |
| CAP-CONN-A12 | 连接保活与启动重试 | 打开连接 → 保活/失败重试 → 关闭时释放 | 自定义保活 SQL 需驱动支持取消 | 已实现 | `app_keepalive.go`；`app_startup_connect_retry_test.go` |
| CAP-CONN-A13 | Driver Agent 在线安装 | 驱动管理 → 检查网络/版本 → 下载 → 启用 | lite/full 构建能力不同 | 已实现 | `DriverManagerModal.tsx`；`methods_driver.go` |
| CAP-CONN-A14 | Driver Agent 离线安装和自定义目录 | 驱动管理 → 选择本地包/目录 → 安装 | 校验平台、版本与代理修订 | 已实现 | `InstallLocalDriverPackage`；`ConfigureDriverRuntimeDirectory` |
| CAP-CONN-A15 | 导入导出加密连接包 | 工具 → 导入/导出 → 选择凭据 → 口令加解密 | 支持旧格式、Workbench XML、Navicat NCX | 已实现 | `connection_package_transfer.go`；`navicat_ncx_import.go` |

### 对象浏览与管理

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-EXP-A01 | 浏览库、Schema、表和对象分组 | 连接树 → 逐级展开 | 惰性加载、刷新和单库模式 | 已实现 | `Sidebar.tsx`；`useSidebarTreeLoaders.tsx` |
| CAP-EXP-A02 | 全库搜索和定位对象 | 侧栏搜索/定位 → 输入名称 → 跳转 | 支持表、列和数据源特定对象 | 已实现 | `FindInDatabaseModal.tsx` |
| CAP-EXP-A03 | 创建数据库 | 数据库菜单 → 创建 → 字符集/排序规则 → 执行 | 依赖驱动和权限 | 部分实现 | `CreateDatabase`；`ListDatabaseCharsets` |
| CAP-EXP-A04 | 重命名和删除数据库 | 数据库右键 → 操作 → 危险确认 | 驱动支持不同 | 部分实现 | `RenameDatabase`；`DropDatabase` |
| CAP-EXP-A05 | 创建、重命名和删除 Schema | Schema 菜单 → 操作 → 刷新 | 依赖数据源 Schema 语义 | 部分实现 | `CreateSchema`；`RenameSchema`；`DropSchema` |
| CAP-EXP-A06 | 查看列、索引和主外键 | 表 → 元数据视图 | 支持数据库级外键关系 | 已实现 | `DBGetColumns/Indexes/ForeignKeys` |
| CAP-EXP-A07 | 查看和编辑视图定义 | 视图 → 定义标签 → 编辑 SQL → 执行 | 支持重命名、删除 | 已实现 | `DefinitionViewer.tsx`；`RenameView` |
| CAP-EXP-A08 | 查看函数、过程、包和事件 | 对象树 → 定义标签 | 可进入对象编辑查询模式 | 已实现 | `DefinitionViewer.object-edit.test.tsx` |
| CAP-EXP-A09 | 查看和编辑触发器 | 触发器 → Trigger Viewer → 编辑 | 部分驱动仅显示不支持提示 | 部分实现 | `TriggerViewer.tsx`；`DBGetTriggers` |
| CAP-EXP-A10 | 查看序列定义 | 序列 → 定义标签 | 依赖驱动对象定义能力 | 已实现 | `methods_db_objects_sequence_test.go` |
| CAP-EXP-A11 | 表重命名和删除 | 表右键 → 操作 → 确认 | 权限或方言不支持时失败 | 已实现 | `RenameTable`；`DropTable` |
| CAP-EXP-A12 | 表复制、截断和清空 | 表右键 → 复制/危险动作 → 倒计时确认 | 复制支持范围按数据源变化 | 部分实现 | `methods_table_copy.go`；`TruncateTables`；`ClearTables` |
| CAP-EXP-A13 | 表概览、行数和存储指标 | 表 → 概览 → 切换视图 | 部分时序库指标未知 | 已实现 | `TableOverview.tsx` |
| CAP-EXP-A14 | 元数据缓存、重试和刷新 | 展开失败 → 重试/刷新 | 连接缓存键隔离并处理并发 | 已实现 | `methods_db_metadata_retry_test.go` |

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

### 数据浏览、编辑与交换

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-DATA-A01 | 分页和虚拟滚动 | 表/查询结果 → 翻页或滚动 | 动态内存限制和稳定布局 | 已实现 | `DataGrid.tsx`；`dataGridVirtualScroll.ts` |
| CAP-DATA-A02 | 排序、筛选和页内查找 | 列头/工具栏 → 条件 → 应用/清除 | 支持列快速查找 | 已实现 | `useDataGridFilters.tsx`；`DataGridPageFind.tsx` |
| CAP-DATA-A03 | 记录视图和大字段预览 | 选择行/单元格 → 记录视图/预览 | JSON、时间、二进制和长文本 | 已实现 | `DataGridRecordViews.tsx`；`DataGridPreviewPanel.tsx` |
| CAP-DATA-A04 | 复制单元格、行和 INSERT | 选择区域 → 复制格式 | 处理表头、转义和 NULL | 已实现 | `dataGridClipboardExport.ts`；`dataGridCopyInsert.ts` |
| CAP-DATA-A05 | 剪贴板批量粘贴 | 选择起点 → 粘贴 → 预览变化 | 只读列不应被覆盖 | 已实现 | `dataGridClipboardPaste.ts` |
| CAP-DATA-A06 | 新增、编辑和删除行 | 表数据 → 修改 → 查看待提交变化 | 依赖可编辑结果和定位键 | 已实现 | `useDataGridBatchActions.ts` |
| CAP-DATA-A07 | 变化预览、批量提交和回滚 | 待提交变化 → 预览 SQL/风险 → 提交或撤销 | 处理部分失败和事务日志 | 已实现 | `PreviewChanges`；`ApplyChanges` |
| CAP-DATA-A08 | 无主键、只读和危险操作保护 | 编辑/删除/清空前 → 检查 → 倒计时确认 | 无法唯一定位时拒绝 | 已实现 | `tableDataDangerActions.ts`；`change_preview.go` |
| CAP-DATA-A09 | 结果 DDL、元数据和 ER 图 | DataGrid 次级视图 → DDL/元数据/ER | SQL Server DDL 当前为占位注释 | 部分实现 | `DataGridV2DdlWorkspace.tsx`；`DataGridErDiagram.tsx` |
| CAP-DATA-A10 | CSV/XLSX 等数据导入 | 表 → 导入 → 预览/映射 → 执行 | 流式 XLSX、批量提交和部分失败 | 已实现 | `DataImportWorkbench.tsx`；`xlsx_import_stream.go` |
| CAP-DATA-A11 | 查询/结果导出 | 结果 → 导出 → 范围/列/格式 → 保存 | CSV、XLSX、JSON、Markdown | 已实现 | `DataExportDialog.tsx`；`ExportQueryWithOptions` |
| CAP-DATA-A12 | 表、Schema 和数据库 SQL 导出 | 对象菜单/导出工作台 → 结构/数据/备份 | 多表、多库和方言字面量 | 已实现 | `TableExportWorkbench.tsx`；`ExportDatabaseSQLWithOptions` |
| CAP-DATA-A13 | 后台导出进度与取消感知 | 启动大导出 → 进度任务 → 完成/失败 | 任务状态需跨标签保持 | 已实现 | `ExportProgressModal.tsx`；`exportProgressTaskStore.ts` |
| CAP-DATA-A14 | 数据库 SQL 导入 | 数据库 → 导入 SQL → 选择文件 → 执行 | 与普通 SQL 文件作业分开 | 已实现 | `DatabaseImportExecutionPanel.tsx`；`ImportDatabaseSQL` |

### 结构设计、同步与结果核对

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-DESIGN-A01 | 新建和修改表结构 | 表设计 → 编辑列/类型/默认值/注释 → SQL 预览 → 执行 | 方言 SQL 不同 | 已实现 | `TableDesigner.tsx`；`tableDesignerSchemaSql.ts` |
| CAP-DESIGN-A02 | 主键和索引设计 | 表设计 → 添加/调整键与索引 → 预览 | DuckDB 主键替换等有边界 | 部分实现 | `tableDesignerIndexSql.ts`；`tableDesignerDuckDbPrimaryKey.ts` |
| CAP-SYNC-A01 | 源目标兼容性分析 | 数据同步 → 选源/目标/模式 → 分析 | 检查表、主键、分页和类型 | 已实现 | `DataSyncWorkbench.tsx`；`analyze.go` |
| CAP-SYNC-A02 | 直接分页导入 | 同步 → 直接导入 → 运行后台任务 | 批量接口按数据源不同 | 已实现 | `direct_import_paging.go`；`sync_engine.go` |
| CAP-SYNC-A03 | 差异预览和增量同步 | 同步 → 差异分析 → 选新增/更新/删除 → 执行 | 仅支持单列主键 | 部分实现 | `preview.go`；`diff_paging.go` |
| CAP-SYNC-A04 | SQL 结果同步到目标表 | 输入源 SQL → 选择唯一目标表 → 导入/差异 | 差异模式要求目标表单列主键 | 部分实现 | `source_query_sync.go` |
| CAP-SYNC-A05 | 自动创建目标表 | 分析 → 结构迁移计划 → 预览 → 执行 | 仅支持部分源/目标组合 | 部分实现 | `schema_migration.go` |
| CAP-SYNC-A06 | 自动补齐目标字段 | 分析现有目标 → 生成 ALTER → 执行 | 不支持的库对只给计划警告 | 部分实现 | `schema_migration.go`；`migration_runtime_helpers.go` |
| CAP-SYNC-A07 | 迁移索引 | 结构迁移 → 生成索引 SQL | 前缀索引和部分索引类型不迁移 | 部分实现 | `schema_migration_test.go` |
| CAP-SYNC-A08 | 专用数据模型迁移 | 选择 MongoDB/Redis/ClickHouse/TDengine 路径 → 专用 planner | 类型和操作范围各异 | 部分实现 | `migration_mongodb.go`；`migration_redis.go`；`migration_clickhouse.go` |
| CAP-DIFF-A01 | 对比两组结果或上传数据 | 结果差异向导 → 选择来源/模式 → 计算 → 分页查看 | 分块上传、会话关闭和数据验证模式 | 已实现 | `frontend/src/components/resultDiff`；`internal/resultdiff` |

### 数据源能力矩阵

每种数据源保留独立 ID。典型任务来自 README 能力矩阵，并由对应驱动实现取证；“部分实现”表示存在明确能力边界，不表示连接不可用。

| ID | 数据源与接入模式 | 典型用户任务 | 已知边界 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-DS-MYSQL | MySQL，内置 | 库表浏览、SQL、编辑、DDL、导入导出和备份 | 权限决定对象范围 | 已实现 | `mysql_impl.go`；`mysql_metadata_test.go` |
| CAP-DS-GOLDENDB | GoldenDB，内置 | MySQL 兼容查询、对象浏览、分布式事务场景 | 复用 MySQL 兼容路径 | 已实现 | `driver_support.go`；`README.zh-CN.md` |
| CAP-DS-POSTGRES | PostgreSQL，内置 | Schema/对象浏览、SQL、编辑和对象管理 | 标识符大小写与 search_path | 已实现 | `postgres_impl.go`；`pg_metadata.go` |
| CAP-DS-ORACLE | Oracle，内置 | Service 连接、对象/包/序列、SQL 和编辑 | 元数据权限与 CLOB DDL | 已实现 | `oracle_impl.go`；`oracle_get_tables_test.go` |
| CAP-DS-REDIS | Redis，内置 | DB/Key、多类型编辑、命令、监控和导入导出 | 非关系型，不支持连接级生产 guard | 已实现 | `methods_redis.go`；`internal/redis` |
| CAP-DS-CHROMA | Chroma，内置 | Collection、向量检索和元数据过滤 | 使用专用查询适配 | 已实现 | `chroma_impl.go` |
| CAP-DS-QDRANT | Qdrant，内置 | Collection、count/scroll/search 和 Payload 过滤 | JSON 命令限白名单动作 | 部分实现 | `qdrant_impl.go` |
| CAP-DS-MILVUS | Milvus，内置 | Collection、向量搜索和标量过滤 | Schema 与维度受服务端约束 | 已实现 | `milvus_impl.go`；`milvus_impl_test.go` |
| CAP-DS-ROCKETMQ | RocketMQ，内置 | Topic、指定消费组的消息预览/消费 | 不提供消费组列表、成员、Lag/Offset 检查；不支持 SSH、代理/HTTP 隧道 | 部分实现 | `rocketmq_impl.go` |
| CAP-DS-MQTT | MQTT，内置 | Broker/Topic Filter、QoS、发布和预览 | 代理模式不支持 WebSocket | 部分实现 | `mqtt_impl.go` |
| CAP-DS-KAFKA | Kafka，内置 | Topic/Broker/Partition 元数据、按 Offset 或 Group 非提交式预览、消息发布 | 不提供消费组列表、成员或 Lag 运维页 | 部分实现 | `kafka_impl.go`；`kafka_impl_test.go` |
| CAP-DS-RABBITMQ | RabbitMQ，内置 | 通过 Management API 浏览 VHost/Queue/Exchange、预览和发布消息 | 需启用 rabbitmq_management 并填写 HTTP(S) 端点；拒绝 AMQP 端口 | 部分实现 | `rabbitmq_impl.go`；`rabbitmq_impl_test.go` |
| CAP-DS-MARIADB | MariaDB，可选 Driver Agent | 查询、对象管理和数据编辑 | 依赖代理安装与版本 | 已实现 | `mariadb_impl.go`；`optional_driver_agent_impl.go` |
| CAP-DS-DORIS | Doris，可选 Driver Agent | 查询、对象浏览和 Explain | 部分元数据复用 MySQL-like | 已实现 | `diros_impl.go`；`explain_parse_doris.go` |
| CAP-DS-STARROCKS | StarRocks，可选 Driver Agent | 分析 SQL、对象浏览和执行 | 版本差异需真实服务验证 | 已实现 | `starrocks_impl.go`；`starrocks_metadata_test.go` |
| CAP-DS-SPHINX | Sphinx/Manticore，可选 Driver Agent | SphinxQL、索引浏览和查询 | 不支持的对象分组会提示 | 部分实现 | `sphinx_impl.go`；`useSidebarTreeLoaders.tsx` |
| CAP-DS-SQLSERVER | SQL Server，可选 Driver Agent | 库表、SQL、列/索引/外键 | DDL 只返回占位注释 | 部分实现 | `sqlserver_impl.go` |
| CAP-DS-SQLITE | SQLite，可选 Driver Agent | 本地文件库、查询、编辑和导出 | 文件权限和 ALTER 能力有限 | 已实现 | `sqlite_impl.go`；`methods_db_sqlite_test.go` |
| CAP-DS-DUCKDB | DuckDB，可选 Driver Agent | 文件库、大表查询、分页和编辑 | 平台构建及部分 ALTER/注释/主键受限 | 部分实现 | `duckdb_impl.go`；`duckdb_platform_supported.go` |
| CAP-DS-OCEANBASE | OceanBase，可选 Driver Agent | MySQL/Oracle 租户、对象和查询 | 导入会话与 ApplyChanges 取决于活动协议 | 部分实现 | `oceanbase_impl.go`；`oceanbase_protocol.go` |
| CAP-DS-DAMENG | 达梦，可选 Driver Agent | 对象、SQL、编辑和 DDL | 方言和大小写独立处理 | 已实现 | `dameng_impl.go`；`dameng_columns_runtime_test.go` |
| CAP-DS-KINGBASE | 人大金仓，可选 Driver Agent | PG-like 对象、查询和编辑 | 标识符规则独立适配 | 已实现 | `kingbase_impl.go`；`kingbase_identifier_utils.go` |
| CAP-DS-HIGHGO | 瀚高，可选 Driver Agent | PG-like 查询、对象和编辑 | 依赖代理版本 | 已实现 | `highgo_impl.go` |
| CAP-DS-VASTBASE | 海量，可选 Driver Agent | PG-like 查询、对象和编辑 | 依赖代理版本 | 已实现 | `vastbase_impl.go` |
| CAP-DS-OPENGAUSS | openGauss，可选 Driver Agent | PG-like 库表、SQL 和对象管理 | 部分能力走 PostgreSQL 兼容路径 | 已实现 | `opengauss_impl.go` |
| CAP-DS-GAUSSDB | GaussDB，可选 Driver Agent | PG-like 库表、SQL 和对象管理 | 部分能力走 PostgreSQL 兼容路径 | 已实现 | `gaussdb_impl.go` |
| CAP-DS-IRIS | InterSystems IRIS，可选 Driver Agent | Namespace、SQL 和对象管理 | Namespace 区别于普通 Schema | 已实现 | `iris_impl.go`；`iris_impl_test.go` |
| CAP-DS-MONGODB | MongoDB，可选 Driver Agent | 集合、文档查询、URI 和成员发现 | SRV 记录模式不支持 SSH | 部分实现 | `mongodb_impl.go`；`MongoDiscoverMembers` |
| CAP-DS-TDENGINE | TDengine，可选 Driver Agent | 时序表/超级表、查询和结构迁移 | ApplyChanges 仅 INSERT | 部分实现 | `tdengine_impl.go`；`tdengine_applychanges_test.go` |
| CAP-DS-IOTDB | Apache IoTDB，可选 Driver Agent | Storage Group/Device/Timeseries 和查询 | 目标写回仅 INSERT | 部分实现 | `iotdb_impl.go`；`iotdb_impl_test.go` |
| CAP-DS-CLICKHOUSE | ClickHouse，可选 Driver Agent | 分析查询、对象、SQL 和迁移 | 旧 HTTP 版本握手需兼容回退 | 已实现 | `clickhouse_impl.go`；`migration_clickhouse.go` |
| CAP-DS-TRINO | Trino，可选 Driver Agent | catalog.schema 和联邦 SQL | 写入/对象管理依赖具体连接器 | 部分实现 | `trino_impl.go`；`trino_impl_test.go` |
| CAP-DS-ELASTICSEARCH | Elasticsearch，可选 Driver Agent | 索引/Mapping、DSL、query_string 和 REST | 仅 ES 6/7/8；高权限 API 禁止 | 部分实现 | `elasticsearch_impl.go`；`internal/esconsole` |
| CAP-DS-CUSTOM | Custom Driver/DSN | 用 Driver 与 DSN 接入额外 SQL 数据源 | 能力取决于代理协议和驱动元数据 | 部分实现 | `driver_support.go`；`optional_driver_agent_impl.go` |

### 专用数据源工作台

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-REDIS-A01 | 游标扫描、搜索和切换 Redis DB | Redis Key 工作台 → DB/模式 → 扫描 | 支持 DB 别名和游标 | 已实现 | `RedisViewer.tsx`；`RedisScanKeys` |
| CAP-REDIS-A02 | 查看和修改 String/Hash | 选择 Key → 值编辑 → 保存 | 编码/视图切换和 TTL | 已实现 | `RedisSetString`；`RedisSetHashField` |
| CAP-REDIS-A03 | 编辑 List/Set/ZSet/Stream | 选择 Key → 类型视图 → 增删改成员 | 每类结构使用专用动作 | 已实现 | `methods_redis.go` |
| CAP-REDIS-A04 | 重命名、删除 Key 和清空 DB | Key 工具栏 → 危险动作 → 确认 | 支持批量删除 | 已实现 | `RedisViewerKeyToolbar.tsx`；`RedisFlushDB` |
| CAP-REDIS-A05 | 执行 Redis 命令 | Redis 命令标签 → 输入 → 执行 | 与 Key 工作台独立 | 已实现 | `RedisCommandEditor.tsx`；`RedisExecuteCommand` |
| CAP-REDIS-A06 | 监控 Redis 服务 | Redis 监控标签 → 轮询 INFO → 查看指标 | 标签非活动时控制轮询 | 已实现 | `RedisMonitor.tsx` |
| CAP-REDIS-A07 | 导入导出 Redis Key | Redis 工具 → 预览导入/选择导出 → 执行 | 未支持类型显式报错 | 部分实现 | `RedisExportKeys`；`RedisImportKeys`；`migration_redis.go` |
| CAP-ES-A01 | 浏览索引、Mapping、Settings 和 Alias | ES 连接树/查询工作台 → 选择索引 | 包含健康与有限 CAT 信息 | 已实现 | `elasticsearch_impl.go` |
| CAP-ES-A02 | 执行 JSON DSL 和 query_string | 查询标签 → 输入查询 → 执行 | 结果复用 DataGrid | 已实现 | `QueryEditorToolbar.elasticsearch.test.tsx` |
| CAP-ES-A03 | Dev Tools 风格 REST 批次 | 输入请求/NDJSON → 检查 → 确认 → 执行 | 支持 bulk/msearch 与确认 token | 已实现 | `methods_elasticsearch_console.go` |
| CAP-ES-A04 | 拦截高权限 ES API | 控制台提交 → 策略检查 → 拒绝/放行 | 禁止安全、快照、节点、集群设置等 | 已实现 | `internal/esconsole/policy.go` |
| CAP-MSG-A01 | 发布消息 | 消息连接 → 发布弹窗 → Topic/路由/QoS → 发送 | 参数随 Kafka/MQTT/Rabbit/Rocket 变化 | 已实现 | `MessagePublishModal.tsx` |
| CAP-MSG-A02 | 从连接树进入消息对象工作流 | 连接树 → Topic/Queue/Exchange/Topic Filter → 打开查询或发布 | 本项仅作聚合入口索引，具体能力见下方各数据源独立 ID | 已实现 | 四类消息驱动与侧栏对象菜单 |
| CAP-MSG-A03 | 预览或消费消息 | 对象菜单/查询 → 选择 offset/filter/batch → 执行 | 各中间件消费语义不同 | 已实现 | 消息驱动 `Query` 实现 |
| CAP-VECTOR-A01 | 浏览 Collection 和 Schema | 向量连接树 → Collection → 元数据 | 三类产品模型不同 | 已实现 | `chroma_impl.go`；`qdrant_impl.go`；`milvus_impl.go` |
| CAP-VECTOR-A02 | 向量检索和标量/元数据过滤 | 查询标签 → 专用查询/JSON → 执行 | 命令集合按驱动限制 | 部分实现 | 三类向量驱动查询实现 |

### 消息与搜索数据源细分

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-ROCKET-A01 | NameServer 单机/集群连接 | RocketMQ 连接 → 填写一个或多个 NameServer → 测试 | 客户端还需访问 Broker 返回地址 | 已实现 | `normalizeRocketMQConfig`；`newRocketMQRuntime` |
| CAP-ROCKET-A02 | Topic 枚举和描述 | RocketMQ 树 → Topic → 打开详情 | 使用 NameServer/Broker 元数据 | 已实现 | `rocketmq_impl.go` 的 ListTopics/DescribeTopic |
| CAP-ROCKET-A03 | 指定消费组预览消息 | Topic → 查询 → SELECT/CONSUME → Group/Tag/起始位点 | 不提交 Offset；不提供 Group 列表、成员和 Lag | 部分实现 | `rocketmq_impl.go` 的 Query/FetchMessages |
| CAP-ROCKET-A04 | 发布带属性和延迟级别的消息 | Topic 右键 → 发送测试消息 → Keys/Tag/Properties/Delay | 支持 18 级延迟消息 | 已实现 | `MessagePublishModal.tsx`；RocketMQ Exec |
| CAP-ROCKET-A05 | TAG 过滤消息计数 | 查询 COUNT → 检查默认 Tag | 配置 Tag 时拒绝 COUNT，只能手动预览 | 部分实现 | `TestRocketMQCountRejectsTagFilteredConnections` |
| CAP-ROCKET-A06 | RocketMQ 字段动态推断 | 打开列元数据 → 拉取最多 20 条消息 → 合并 Payload 字段 | 会产生读取活动并可能等待 10 秒 | 部分实现 | `rocketmq_impl.go:377` |
| CAP-MQTT-A01 | TCP/TLS/WebSocket 与多 Broker 连接 | MQTT 连接 → URI/Broker 列表/QoS → 测试 | 代理 + WebSocket 组合不支持 | 部分实现 | `normalizeMQTTConfig`；`mqtt_impl.go` |
| CAP-MQTT-A02 | Topic Filter 树 | MQTT 连接树 → 展开配置的 Topic Filter | 树来自配置，不是 Broker 全量 Topic 枚举 | 部分实现 | `mqtt_impl.go`；侧栏消息对象加载 |
| CAP-MQTT-A03 | 实时订阅预览 | Topic Filter → 查询 → 等待消息 → 展示 | 受 fetchWait、QoS 和通配符影响；不支持总量统计 | 部分实现 | `mqtt_impl.go` 的 Query/FetchMessages |
| CAP-MQTT-A04 | 发布 QoS/Retain 消息 | Topic Filter 右键 → 发送 → Topic/QoS/Retain | `+`、`#` 通配符不能作为发布目标 | 已实现 | `MessagePublishModal.tsx`；MQTT Exec |
| CAP-MQTT-A05 | MQTT 字段动态推断 | 打开列元数据 → 临时订阅并等待最多 20 条消息 | 会产生订阅活动并可能等待 10 秒 | 部分实现 | `mqtt_impl.go:332` |
| CAP-KAFKA-A01 | 多 Broker、TLS 与 SASL 连接 | Kafka 连接 → Broker 列表/TLS/SASL → 测试 | 支持 PLAIN、SCRAM 等配置 | 已实现 | `normalizeKafkaConfig`；`kafka_impl.go` |
| CAP-KAFKA-A02 | Topic、Broker 和 Partition 元数据 | Kafka 树 → Topic → 描述 | 展示分区和 Broker 元数据 | 已实现 | `TestKafkaQueryShowTopicsAndDescribeTopic` |
| CAP-KAFKA-A03 | 按 Offset 或 Group 非提交式预览 | Topic → SELECT/CONSUME → Offset/Group → 执行 | 不提交消费位点；不是消费组运维检查 | 部分实现 | `TestKafkaQuerySelectAndConsumeKeepTopicNameIntact` |
| CAP-KAFKA-A04 | 近似消息总数 | Topic → COUNT/统计 | 基于分区 earliest/latest offset 估算 | 已实现 | `kafka_impl.go` 的 count 路径 |
| CAP-KAFKA-A05 | 发布 Key、Value 和 Headers | Topic 右键 → 发送测试消息 → 填写字段 | 审计记录发布命令 | 已实现 | `TestKafkaExecPublishesJSONCommand` |
| CAP-KAFKA-A06 | Kafka 字段动态推断 | 打开列元数据 → 拉取最多 20 条消息 → 合并字段 | 会产生 Fetch 活动并要求消息读取权限 | 部分实现 | `kafka_impl.go:330`；`TestKafkaGetColumnsIncludesDerivedFields` |
| CAP-RABBIT-A01 | Management HTTP(S) 连接 | RabbitMQ 连接 → Management URI/端口 → 测试 | 拒绝 5672/5671 AMQP(S) 端口 | 部分实现 | `validateRabbitMQManagementPort` |
| CAP-RABBIT-A02 | VHost、Queue 和 Exchange 浏览 | RabbitMQ 树 → 展开对象 → 查看描述 | 依赖 rabbitmq_management 插件和 API 权限 | 已实现 | `rabbitmq_impl.go` 的 GetDatabases/GetTables/GetCreateStatement |
| CAP-RABBIT-A03 | Queue 消息取样预览 | Queue → 查询 → Management `/get` → 展示 | 使用 `ack_requeue_true`，可能产生 redelivered/顺序扰动 | 部分实现 | `rabbitmq_impl.go:821` |
| CAP-RABBIT-A04 | 通过 Exchange/Routing Key 发布 | Queue/Exchange → 发送 → Payload/Headers/Properties | 发布也经 Management API | 已实现 | RabbitMQ Exec；`MessagePublishModal.tsx` |
| CAP-RABBIT-A05 | RabbitMQ 字段动态推断 | 打开列元数据 → 取样最多 20 条消息 → 合并字段 | 取样后重入队，可能影响顺序观察 | 部分实现 | `rabbitmq_impl.go:383`；`TestRabbitMQQueryExecAndColumns` |
| CAP-SPHINX-A01 | 安装并连接 Sphinx/Manticore Driver Agent | 驱动管理 → 安装 → 新建 Sphinx 连接 | 依赖可选代理与 MySQL 协议端口 | 已实现 | `sphinx_impl.go`；`optional_driver_agent_impl.go` |
| CAP-SPHINX-A02 | 索引枚举与 SHOW TABLES 回退 | Sphinx 树 → 展开索引 | 不支持 `SHOW TABLES FROM` 时回退普通语法 | 已实现 | `sphinx_impl.go` |
| CAP-SPHINX-A03 | 字段与 indexed 属性 | 索引 → 元数据/列 | 通过 DESCRIBE 映射字段属性 | 已实现 | `sphinx_impl.go` 的 GetColumns |
| CAP-SPHINX-A04 | SphinxQL 查询 | 查询标签 → 输入 SphinxQL → 执行 | 对象与 DDL 能力不同于关系库 | 已实现 | `sphinx_impl.go` 的 Query |
| CAP-SPHINX-A05 | 不支持对象的显式提示 | 展开 View/Routine/Trigger → 显示限制 | 无专门驱动测试文件，需真实版本验证 | 部分实现 | `useSidebarTreeLoaders.tsx`；`TriggerViewer.tsx` |
| CAP-ES-A05 | 隐藏索引、Alias、Mapping 和 Settings | ES 树 → 索引/alias → 打开定义 | 版本 6/7/8 行为需分版本验证 | 已实现 | `elasticsearch_impl.go` |
| CAP-ES-A06 | 表格与原始 HTTP 响应切换 | ES 查询结果 → 切换视图 | 非命中类 API 主要查看原始响应 | 已实现 | ES 查询结果组件与测试 |
| CAP-ES-A07 | 当前请求、整批、Bulk 和 MSearch | ES 工具栏 → 选择执行范围 → 执行 | NDJSON 格式和部分失败需单独观察 | 已实现 | `methods_elasticsearch_console.go`；`internal/esconsole` |
| CAP-ES-A08 | Elasticsearch 文档编辑 | 查询结果 → 编辑文档 → 预览/提交 | 依赖物理索引解析和安全检查 | 已实现 | `elasticsearch_impl.go` 的 ApplyChanges |
| CAP-ES-A09 | 一次性确认令牌与物理索引校验 | 提交危险 REST → 预检 → 确认 → 执行 | 脚本和高权限端点仍被拒绝 | 已实现 | `InspectElasticsearchConsole`；`ExecuteElasticsearchConsole` |
| CAP-ES-A10 | 模板、格式化和 AI 生成 ES 请求 | ES 查询工具栏 → 模板/格式化/AI → 编辑器 | AI 输出仍需策略预检 | 已实现 | `QueryEditorToolbar.elasticsearch.test.tsx` |

### AI、MCP 与 Web

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-AI-A01 | 配置和测试多模型 Provider | AI 设置 → Provider → 模型/API/密钥 → 测试 | OpenAI、Gemini、Claude、兼容 API 与 CLI | 已实现 | `AISettingsModal.tsx`；`internal/ai/provider` |
| CAP-AI-A02 | 多会话流式对话 | AI 面板 → 新建会话 → 提问 → 流式输出/取消 | 会话边界、思考强度和错误恢复 | 已实现 | `AIChatPanel.tsx`；`service_stream_cancel_test.go` |
| CAP-AI-A03 | 注入连接、Schema 和 SQL 上下文 | AI 对话 → 选择上下文 → 预览 → 发送 | 上下文大小和敏感信息边界 | 已实现 | `AIChatContextPreview.tsx`；`internal/ai/context` |
| CAP-AI-A04 | 添加附件 | AI 输入 → 添加附件 → 查看条带 → 发送/移除 | 运行环境决定本地文件读取能力 | 已实现 | `AIChatAttachmentStrip.tsx` |
| CAP-AI-A05 | 生成、解释和优化 SQL | 查询编辑器/AI → 快捷动作 → 应用结果 | 结合当前方言和表结构 | 已实现 | `QueryEditor.tsx`；`builder.go` |
| CAP-AI-A06 | 调用数据库内置工具 | AI 对话 → 工具选择/自动调用 → 展示结果 | 危险 SQL 由安全分类器拦截 | 已实现 | `AIBuiltinToolsCatalog.tsx`；`internal/ai/safety` |
| CAP-AI-A07 | 应用健康、连接和日志诊断 | AI 检查模式 → 采集快照 → 生成洞察 | 日志读取和运行时能力可能不可用 | 部分实现 | `aiSnapshotInspection*Executor.ts`；`aiAppHealthInsights.ts` |
| CAP-AI-A08 | 管理复用 AI Skills | AI 设置 → Skills → 创建/编辑/启用 | 全局、数据库、JVM 和诊断范围 | 已实现 | `AISkillSettingsSection.tsx`；`AISkillScope` |
| CAP-MCP-A01 | 配置和测试外部 MCP Server | AI 设置 → MCP Server → 命令/环境 → 测试 | 工具发现、别名和环境变量提示 | 已实现 | `frontend/src/components/ai/AIMCP*` |
| CAP-MCP-A02 | 调用外部 MCP 工具 | AI 对话 → 选择/自动调用工具 → 查看内容 | 处理工具错误和 Schema 提示 | 已实现 | `extensions_service.go` |
| CAP-MCP-A03 | 安装 Claude Code、Codex、OpenCode 配置 | 客户端状态 → 安装/替换配置 | 旧后端缺绑定时显式提示 | 已实现 | `useAIMCPClientInstaller.ts`；`internal/ai/service/*mcp.go` |
| CAP-MCP-A04 | 启动 Streamable HTTP MCP | MCP 设置/独立命令 → 地址/路径/schema-only → 启动 | 支持状态检查和停止 | 已实现 | `mcp_http_server.go`；`cmd/gonavi-mcp-server` |
| CAP-WEB-A01 | 浏览器访问完整工作台 | 启动 Web Server → 登录 → 后端桥 → 工作台 | 实验性；本轮未做浏览器端到端验证 | 部分实现 | `internal/webserver`；`README.zh-CN.md` |
| CAP-WEB-A02 | Web 首次设置、登录和 TOTP | 访问 `/setup` → 管理员密码/可选 TOTP → 登录 | 反向代理和 Cookie/Session 需安全配置 | 已实现 | `WebAuthSettingsPanel.tsx`；`internal/webserver` |
| CAP-WEB-A03 | Docker、Podman、K8s 和 Helm 部署 | 部署文件 → 配置环境 → 启动 Web/MCP | 公网需要 HTTPS 和反向代理 | 已实现 | `Dockerfile.web-server`；`deploy`；`docker-compose.*` |

### Nacos

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-NACOS-A01 | 连接和浏览命名空间 | 新建 Nacos 连接 → 认证 → 命名空间树 | API v1/v2、认证刷新和缓存 | 已实现 | `methods_nacos.go`；`internal/nacos/client.go` |
| CAP-NACOS-A02 | 搜索和读取配置 | 配置工作台 → namespace/group/dataId → 搜索/打开 | 支持分组过滤 | 已实现 | `NacosViewer.tsx`；`NacosSearchConfigs` |
| CAP-NACOS-A03 | 发布、Beta 和删除配置 | 配置 → 编辑/发布/Beta/删除 → 确认 | MD5、Beta 停止和危险操作 | 已实现 | `NacosPublishConfig`；`NacosStopBetaConfig` |
| CAP-NACOS-A04 | 配置历史 | 配置 → 历史 → 选择版本 | 依赖服务端历史接口 | 已实现 | `NacosListConfigHistory`；`NacosGetConfigHistory` |
| CAP-NACOS-A05 | 配置监听 | 配置 → 开始监听 → 接收变化 → 停止 | watch ID、MD5 更新和竞态处理 | 已实现 | `methods_nacos_listen.go`；`listen_test.go` |
| CAP-NACOS-A06 | 配置导入导出 | Nacos 工具 → 导出或预览导入 → 执行 | namespace、group 和冲突策略 | 已实现 | `methods_nacos_transfer.go` |
| CAP-NACOS-A07 | 创建、修改和删除服务 | 服务工作台 → 填写服务 → 保存/删除 | Nacos v1 部分临时服务不支持 | 部分实现 | `NacosServiceViewer.tsx`；`naming.go` |
| CAP-NACOS-A08 | 实例注册、更新、摘除和健康管理 | 服务 → 实例 → 操作 → 刷新 | 权重、健康、临时实例和版本边界 | 已实现 | `NacosRegister/Update/DeregisterInstance` |

### JVM 运维

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-JVM-A01 | JMX、HTTP 或 Agent 连接 | 新建 JVM 连接 → Provider → 测试 | 能力探测和目标可达性 | 已实现 | `methods_jvm.go`；`internal/jvm/provider.go` |
| CAP-JVM-A02 | JVM 概览 | JVM 概览标签 → 查看状态和基础指标 | 指标随 Provider 变化 | 已实现 | `JVMOverview.tsx` |
| CAP-JVM-A03 | 资源树和值读取 | JVM 资源标签 → 展开路径 → 读取值 | MBean/资源路径按 Provider 映射 | 已实现 | `JVMResourceBrowser.tsx`；`JVMGetValue` |
| CAP-JVM-A04 | 配置变更预览和应用 | 资源 → 修改 → 预览 → 应用 | Guard、审计和失败恢复 | 已实现 | `JVMChangePreviewModal.tsx`；`JVMApplyChange` |
| CAP-JVM-A05 | 实时监控和历史 | 监控标签 → 启动 → 图表/详情 → 停止 | 采样生命周期和状态恢复 | 已实现 | `JVMMonitoringDashboard.tsx`；`methods_jvm_monitoring.go` |
| CAP-JVM-A06 | 诊断能力探测和会话 | 诊断控制台 → 探测 → 开始会话 | 目标不支持时禁用相应命令 | 已实现 | `JVMProbeDiagnosticCapabilities`；`JVMStartDiagnosticSession` |
| CAP-JVM-A07 | 执行、取消和脱敏诊断输出 | 预设/命令 → 执行/取消 → 查看流式输出 | 输出脱敏和命令审计 | 已实现 | `JVMDiagnosticConsole.tsx`；`methods_jvm_diagnostic.go` |
| CAP-JVM-A08 | 变更与诊断审计 | JVM 审计 → 查看记录 | 两类审计分开存储 | 已实现 | `JVMAuditViewer.tsx`；`JVMListAuditRecords` |

### 平台、设置与交付

| ID | 具体能力 | 用户入口与操作 | 边界/异常 | 状态 | 证据 |
|---|---|---|---|---|---|
| CAP-OPS-A01 | 加密云备份和立即同步 | 设置 → 云备份 → Provider/口令/类别 → 同步 | 远端不可用、口令错误和冲突 | 已实现 | `CloudBackupSettings.tsx`；`cloud_backup.go` |
| CAP-OPS-A02 | 恢复点预览和分类恢复 | 云备份 → 恢复点 → 预览差异 → 选择类别 → 恢复 | 连接、查询等分类处理 | 已实现 | `CloudBackupRestoreDialog.tsx` |
| CAP-OPS-A03 | 自定义数据根目录并迁移 | 设置 → 数据目录 → 选择 → 是否迁移 → 应用 | 路径校验和重启影响 | 已实现 | `methods_data_root.go` |
| CAP-OPS-A04 | 自定义日志目录 | 设置 → 日志目录 → 选择/应用/打开 | 变更可能需重启 | 已实现 | `methods_log_directory.go` |
| CAP-OPS-A05 | 自定义保存查询目录 | 设置 → 查询目录 → 应用；查询 → 在文件夹显示 | Web 和桌面文件能力不同 | 已实现 | `methods_saved_query_directory.go` |
| CAP-OPS-A06 | 中英文切换 | 设置/标题栏 → 语言 → 即时更新 | 后端错误也使用当前语言 | 已实现 | `LanguageSettingsPanel.tsx`；`SetLanguage` |
| CAP-OPS-A07 | 主题、字体和表格显示 | 外观设置 → 主题/字体/字号/表格选项 | 数据表字号可独立或跟随 | 已实现 | `App.tsx`；`MonacoEditor.theme.test.ts` |
| CAP-OPS-A08 | 快捷键管理 | 快捷键设置 → 搜索 → 改键/恢复 | 查询、标签、侧栏、AI、日志、主题、全屏 | 已实现 | `App.tsx` 快捷键 action 分发 |
| CAP-OPS-A09 | 结果和 AI 浮动窗口 | 结果/AI → 分离 → 浮动查看 → 关闭 | 主窗口状态同步 | 已实现 | `FloatingWorkbenchWindows.tsx`；`FloatingAIChatWindow.tsx` |
| CAP-OPS-A10 | 原生分离窗口和重新停靠 | 标签拖出 → 子进程窗口 → 关闭/停靠 | SSE 桥、父进程退出和关闭门控 | 已实现 | `NativeDetachedWindowController.tsx`；`internal/nativewindow` |
| CAP-OPS-A11 | 退出前后台任务保护 | 关闭应用 → 检查任务/子窗口 → 取消或强退 | 防止任务静默丢失 | 已实现 | `application_quit.go`；`background-task-detach.test.ts` |
| CAP-OPS-A12 | 更新检查和通道切换 | 关于/更新 → latest/dev → 检查 | 静默检查和发布说明 | 已实现 | `UpdateReleaseNotesModal.tsx`；`update_channel_state.go` |
| CAP-OPS-A13 | 下载、安装更新并重启 | 更新 → 下载 → 安装 → 重启 | Windows/macOS 安装路径不同 | 已实现 | `methods_update.go`；`windows_msi_update.ps1` |
| CAP-OPS-A14 | 安全更新、重试和回滚 | 安全更新提示 → 分轮执行 → 重试/回滚 | 来源校验和状态持久化 | 已实现 | `SecurityUpdate*`；`security_update_engine.go` |
| CAP-OPS-A15 | 自定义品牌图标 | 设置 → 选择图标 → 应用 | macOS 与其他平台支持差异 | 部分实现 | `BrandIconPicker.tsx`；`methods_brand_icon.go` |
| CAP-OPS-A16 | Linux 中文字体提示 | Linux 启动 → 检测字体 → 展示安装建议 | 仅特定平台和 CJK 环境 | 已实现 | `LinuxCJKFontBanner.tsx`；`methods_fonts.go` |

## 当前验证盲区

- 34 类数据源均已建立独立能力条目，但未对每个版本、权限组合和真实大数据量逐项联调。
- Web Server、MCP 远端模式、Driver Agent 流式回退和容器部署只完成静态与测试证据核验，未在本轮做端到端运行。
- Windows、macOS、Linux 的安装、更新、原生窗口和系统密钥环未在三平台同时实测。
- 功能地图只记录有实现证据的 GoNavi 现有能力，不把路线图内容混入能力状态。
