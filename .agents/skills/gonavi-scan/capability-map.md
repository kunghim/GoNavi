# GoNavi 功能地图索引

> scan_id: `incremental-20260811-46d3afb3`
> head_commit: `46d3afb36e8b04c1931ccad03880d5f5d9390d5f`

> 本轮为增量复查，从 `dev@8c111ab02764c453fc95362a2a4004c326cff447` 覆盖至合并后的 `dev@46d3afb36e8b04c1931ccad03880d5f5d9390d5f`，重点验证 MQTT 代理 WebSocket 与 syncjob 终态事件修复。本索引由 `gonavi-scan` 维护；“本次范围内未找到实现证据”不代表功能不存在。

## 使用规则

- 本文件只维护覆盖账本、聚合能力索引和验证盲区。
- 详细能力节点按领域保存在 [`capabilities/`](capabilities/) 下的中文文件中。
- 稳定能力 ID 不因拆分改名；跨领域能力只在归属分册定义，其他分册和入口账本通过 ID 引用。

## 覆盖账本

| 入口层 | 已枚举范围 | 映射结果 |
|---|---|---|
| 工作台与标签 | `TabData` 定义的 26 类标签/工作台 | 26 项已在入口账本完整列举并映射到查询、数据、对象、同步、Redis、Nacos、JVM 和审计能力 |
| 数据源 | `driver_support.go` 的 12 个内置、21 个具名可选数据源及 Custom Driver/DSN | 34 项均有独立数据源能力 ID；Nacos/JVM 作为专用服务入口另行映射 |
| 设置与工具 | 偏好、服务、配置、工作流、工作区和关于分组的 21 类入口 | 已映射到连接、平台、同步、AI/MCP/Web、审计和交付能力 |
| 前端操作 | 标题栏、侧栏、Legacy/V2 菜单、右键动作、查询工具栏和文件工作流 | 已按用户任务聚合枚举；专用数据源 SQL 门控不一致记录为正式发现 |
| 后端入口 | `internal/app` 方法族、数据库驱动、同步、Redis、Nacos、JVM、AI 和审计服务 | 已与前端入口交叉取证 |
| 独立运行面 | 桌面端、Web Server、MCP Server、无头 CLI、Driver Agent 和四类容器 | 已映射；服务信号生命周期问题记录为正式发现 |
| 本轮未实测 | 真实外部数据源、跨平台安装升级、桌面 UI、Web 完整浏览器流程和外部写操作 | 保留为验证盲区，不声称已运行 |

## 聚合能力索引

| 功能 ID | 产品领域 | 详细分册 | 当前状态 |
|---|---|---|---|
| CAP-CONN-001..003、CAP-CONN-A01..A15 | 数据连接与驱动 | [数据连接](capabilities/数据连接.md) | 部分实现 |
| CAP-EXP-001、CAP-EXP-A01..A14 | 对象浏览 | [对象浏览](capabilities/对象浏览.md) | 依能力而异 |
| CAP-QUERY-001..002、CAP-QUERY-A01..A16、CAP-AUDIT-* | SQL 查询与治理 | [SQL查询与治理](capabilities/SQL查询与治理.md) | 依能力而异 |
| CAP-DATA-001..002、CAP-DESIGN-001、CAP-DATA-A01..A14 | 数据操作与结构设计 | [数据操作与结构设计](capabilities/数据操作与结构设计.md) | 依能力而异 |
| CAP-SYNC-001、CAP-SYNC-A01..A09、CAP-DIFF-A01 | 数据同步与结果差异 | [数据同步与结果差异](capabilities/数据同步与结果差异.md) | 部分实现 |
| CAP-DS-*（关系型、分析型） | 关系型与分析型数据源 | [关系型数据源](capabilities/关系型数据源.md) | 依数据源而异 |
| CAP-DS-*（消息、搜索）及 CAP-ROCKET/MQTT/KAFKA/RABBIT/SPHINX/ES-* | 消息与搜索数据源 | [消息与搜索数据源](capabilities/消息与搜索数据源.md) | 依数据源而异 |
| CAP-DS-*（向量、缓存）及 CAP-VECTOR-* | 向量与缓存数据源 | [向量与缓存数据源](capabilities/向量与缓存数据源.md) | 依数据源而异 |
| CAP-REDIS-001、CAP-ES-001、CAP-NACOS-001、CAP-JVM-001 及细分能力 | 专用工作台与运维 | [专用工作台](capabilities/专用工作台.md) | 依能力而异 |
| CAP-AI-001、CAP-MCP-001、CAP-WEB-001、CAP-CLI-001 及细分能力 | AI、MCP、Web 与 CLI | [AI、MCP与Web](capabilities/AI、MCP与Web.md) | 依能力而异 |
| CAP-OPS-001、CAP-OPS-A01..A16 | 平台设置与交付 | [平台设置与交付](capabilities/平台设置与交付.md) | 依能力而异 |

## 本轮发现与修复复查

- 本轮新增归档 2 项：MQTT 代理 WebSocket 与 syncjob 终态事件原子持久化。
- 当前仍有 6 条活跃发现：SSH 主机密钥、Chroma/Qdrant 字段取样、向量简化 SQL WHERE、专用数据源 SQL 入口、Redis 高可用 SSH 配置、Web/MCP 信号生命周期。
- 两个修复提交均已合入当前 `dev`，聚焦测试、相关完整包测试及 syncjob 原失败场景连续 100 次复测通过。

## 当前验证盲区

- `connections.local.yaml` 没有可用实例记录；34 类数据源未在本轮逐一连接真实版本、权限、TLS、SSH、代理和大数据量环境。
- Web Server、MCP 远端模式、Driver Agent 流式回退和容器部署只完成静态与自动化测试证据核验，未做端到端运行。
- Windows、macOS、Linux 的安装、更新、原生窗口、系统密钥环和服务信号未在三平台同时实测。
- CLI Windows ACL 测试受 Codex 沙箱给临时目录附加 SID 影响，不登记为产品 Bug；需在普通非沙箱 Windows 终端复测。稳定 GitHub CLI 资产、npm 与 WinGet 渠道尚未首发。
- 数据库元数据接口缺少统一 context/timeout 契约、部分 HTTP 数据源响应体未统一限流，当前缺少可稳定判定用户影响的复现路径，暂记覆盖盲区。
- `generate-winget-cli-manifest.test.py` 在 Windows 只提供 `python`/`py` 时的便携性与 CLI 发布测试临时目录行为属于测试覆盖盲区，未冒充产品故障。
- 本轮未执行外部写操作、桌面 UI 流程或中间人网络实验；所有此类结论均保持代码证据或待验证边界。
