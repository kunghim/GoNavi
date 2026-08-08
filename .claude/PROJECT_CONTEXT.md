# GoNavi 项目上下文

## 定位

GoNavi 是一个以桌面端为主的跨平台数据库工作台：连接、SQL 查询、数据编辑、导入导出、同步迁移、审计、AI 辅助和 MCP/Agent 接入集中在同一个应用中。项目优先考虑原生性能、较小体积和多数据源能力，不是只面向 MySQL 的简单查询工具。

## 技术栈

- Go 1.25，模块名 `GoNavi-Wails`
- Wails v2.11.0，桌面窗口和 Go/前端绑定
- React 18、TypeScript、Vite
- Ant Design 5、Zustand、Monaco Editor
- Vitest 前端测试，Go `testing` 后端测试
- Windows 使用 WebView2；Linux/macOS 使用各自系统 WebView/WebKit 路径

## 运行模式

`main.go` 是统一入口：

- 无参数：Wails 桌面应用
- `web-server`：浏览器访问的认证 Web Server
- `mcp-server stdio/http`：本地或 Streamable HTTP MCP Server
- `detached-window`：原生独立窗口

## 主要能力

- 关系型数据库：MySQL、PostgreSQL、Oracle、GoldenDB 等
- 缓存、消息、向量、搜索和时序数据源
- 内置驱动与可选 driver-agent 分离
- Monaco SQL 编辑器、库表/字段上下文补全、虚拟滚动 DataGrid
- AI Provider、会话、安全级别和表结构上下文
- SQL 审计、事务、结果导出、备份、同步和迁移

## 当前上下文基线

本地上下文最初基于 `upstream/dev` 提交 `772d8391` 建立。若上游发生架构级变化，应更新本目录的模块索引，而不是每次会话重新阅读全仓库。


