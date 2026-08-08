# GoNavi 架构索引

## 总体调用关系

```text
React / Monaco / DataGrid
        |
        | Wails binding 或 Web RPC bridge
        v
internal/app：应用编排、连接缓存、查询、事务、审计
        |
        v
internal/db：Database 能力接口和数据源实现
```

AI 和 MCP 既可以调用应用层能力，也可以通过独立运行模式暴露给外部 Agent：

```text
internal/ai -> provider/context/safety/service
internal/mcpserver -> internal/app / connection / schema context
internal/webserver -> authenticated HTTP + frontend bridge
```

## 后端模块

| 模块 | 职责 | 首要入口 |
| --- | --- | --- |
| `internal/app` | Wails 暴露的应用服务、连接缓存、查询、事务、审计、备份 | `internal/app/app.go` |
| `internal/db` | 统一数据库接口、元数据、查询/写入和各驱动实现 | `internal/db/database.go` |
| `internal/connection` | 连接配置、URI、保存查询和解释计划类型 | `internal/connection` |
| `internal/ai` | Provider、上下文收集、安全策略、AI 服务 | `internal/ai` |
| `internal/mcpserver` | MCP stdio、HTTP、远程客户端配置 | `internal/mcpserver/run.go` |
| `internal/webserver` | Web Server、登录鉴权、Wails RPC 的浏览器桥接 | `internal/webserver/server.go` |
| `internal/sync` | 结构对齐、差异分页、迁移、同步预览和执行 | `internal/sync` |
| `internal/jvm` | JVM Agent、JMX、HTTP/Arthas 诊断和审计 | `internal/jvm` |
| `internal/secretstore` | 密码和密钥的系统安全存储 | `internal/secretstore` |

## 前端模块

- `frontend/src/App.tsx`：应用壳、浏览器 Mock 适配和页面组装
- `frontend/src/store.ts`：跨页面状态、连接/标签页/AI/设置状态
- `frontend/src/components/QueryEditor.tsx`：Monaco SQL 编辑器和快捷键
- `frontend/src/components/MonacoEditor.tsx`：Monaco 通用封装、主题和 WebKit 兼容
- `frontend/src/components/DataGrid*.tsx`：结果展示、虚拟滚动、编辑、导出和 ER 图
- `frontend/src/components/ConnectionModal.tsx`：连接创建、编辑和各数据源配置
- `frontend/src/utils`：能力矩阵、快捷键、数据网格、导入导出和状态纯函数
- `shared/i18n`：Go/前端共享的六种语言资源

## 驱动边界

默认构建不启用所有可选驱动。DuckDB 等实现含 build tags，driver-agent 的构建和发布脚本在根目录 `build-driver-agents.sh`、`tools/` 和 CI 中维护。修改数据库接口时，优先检查 `internal/db` 的能力接口、调用方和对应实现测试。


