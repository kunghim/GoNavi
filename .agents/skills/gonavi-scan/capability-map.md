# GoNavi 功能地图索引

> scan_id: `state-migration-20260809`
> head_commit: `1de297628effe5e79cd756f83ee850744abd9537`

> 增量基线状态：不可用（本轮为状态迁移，未建立可用于增量比较的上次成功扫描基线）。本索引由 `gonavi-scan` 维护；“本次范围内未找到实现证据”不代表功能不存在。

## 使用规则

- 本文件只维护覆盖账本、聚合能力索引和验证盲区。
- 详细能力节点按领域保存在 [`capabilities/`](capabilities/) 下的中文文件中。
- 稳定能力 ID 不因拆分改名；扫描时只读取和更新受影响领域文件，避免重复维护。

## 覆盖账本

| 入口层 | 已枚举范围 | 映射结果 |
|---|---|---|
| 工作台与标签 | `TabData` 定义的 26 类标签/工作台 | 已映射到查询、数据、对象、Redis、Nacos、JVM、审计等能力 |
| 数据源 | README 能力矩阵的 12 个内置、21 个具名可选数据源及 Custom Driver/DSN | 34 项均有独立条目 |
| 前端操作 | 侧栏、标题栏、工具入口、设置页、菜单、右键动作和弹窗 | 已按用户可验证任务拆分 |
| 后端入口 | `internal/app` 对外方法族及 DB、同步、AI、JVM、Nacos 服务 | 已与前端入口交叉取证 |
| 独立运行面 | 桌面端、Web Server、MCP Server、Driver Agent、容器部署 | 已映射 |
| 本轮未实测 | 真实外部数据源、跨平台安装升级、Web 完整浏览器流程 | 保留为验证盲区，不声称已运行 |

## 聚合能力索引

| 功能 ID | 产品领域 | 详细分册 | 当前状态 |
|---|---|---|---|
| CAP-CONN-001..003 | 数据连接与驱动 | [数据连接](capabilities/数据连接.md) | 已实现 |
| CAP-EXP-001 | 对象浏览 | [对象浏览](capabilities/对象浏览.md) | 已实现 |
| CAP-QUERY-001..002、CAP-ANALYZE-001 | SQL 查询与治理 | [SQL查询与治理](capabilities/SQL查询与治理.md) | 已实现 |
| CAP-DATA-001..002、CAP-DESIGN-001 | 数据操作与结构设计 | [数据操作与结构设计](capabilities/数据操作与结构设计.md) | 已实现 |
| CAP-SYNC-001 | 数据同步与结果差异 | [数据同步与结果差异](capabilities/数据同步与结果差异.md) | 部分实现 |
| CAP-DS-*（关系型、分析型） | 关系型与分析型数据源 | [关系型数据源](capabilities/关系型数据源.md) | 依数据源而异 |
| CAP-DS-*（消息、搜索）及 CAP-MSG-* | 消息与搜索数据源 | [消息与搜索数据源](capabilities/消息与搜索数据源.md) | 依数据源而异 |
| CAP-DS-*（向量、缓存）及 CAP-VECTOR-* | 向量与缓存数据源 | [向量与缓存数据源](capabilities/向量与缓存数据源.md) | 依数据源而异 |
| CAP-REDIS-001、CAP-ES-001、CAP-NACOS-001、CAP-JVM-001 | 专用工作台与运维 | [专用工作台](capabilities/专用工作台.md) | 已实现 |
| CAP-AI-001、CAP-MCP-001、CAP-WEB-001 | AI、MCP 与 Web | [AI、MCP与Web](capabilities/AI、MCP与Web.md) | 已实现 |
| CAP-OPS-001 | 平台设置与交付 | [平台设置与交付](capabilities/平台设置与交付.md) | 已实现 |

## 当前验证盲区

- 34 类数据源均已建立独立能力条目，但未对每个版本、权限组合和真实大数据量逐项联调。
- Web Server、MCP 远端模式、Driver Agent 流式回退和容器部署只完成静态与测试证据核验，未在本轮做端到端运行。
- Windows、macOS、Linux 的安装、更新、原生窗口和系统密钥环未在三平台同时实测。
- 功能地图只记录有实现证据的 GoNavi 现有能力，不把路线图内容混入能力状态。
