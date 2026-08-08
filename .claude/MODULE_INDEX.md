# 按任务定位模块

| 任务 | 先读 | 常见测试 |
| --- | --- | --- |
| SQL 编辑器、补全、快捷键 | `frontend/src/components/QueryEditor.tsx`, `MonacoEditor.tsx`, `frontend/src/utils/shortcuts.ts` | `frontend/src/components/QueryEditor*.test.tsx`, `frontend/src/utils/shortcuts.test.ts` |
| 数据结果、列宽、筛选、编辑、导出 | `frontend/src/components/DataGrid*.tsx`, `frontend/src/utils/dataGrid*` | `frontend/src/components/DataGrid*.test.tsx`, 对应 `utils/*.test.ts` |
| 连接配置和数据源选择 | `frontend/src/components/ConnectionModal.tsx`, `internal/connection`, `internal/app` | `ConnectionModal*.test.tsx`, `internal/connection/*_test.go` |
| 数据库驱动、元数据、查询 | `internal/db/database.go`, 对应 `*_impl.go`, `internal/app` | `internal/db/*_test.go`, 对应 `internal/app/*_test.go` |
| AI Provider、上下文、安全策略 | `internal/ai`, `frontend/src/utils/ai*`, AI 面板组件 | `internal/ai/**/*_test.go`, 对应前端测试 |
| MCP、Agent 客户端安装 | `internal/mcpserver`, `internal/ai/service`, `frontend/src` MCP 设置组件 | `internal/mcpserver/*_test.go`, `internal/ai/service/*_test.go` |
| 同步、迁移、差异比较 | `internal/sync` | `internal/sync/*_test.go` |
| Web Server、登录鉴权 | `internal/webserver`, `internal/app` | `internal/webserver/*_test.go` |
| JVM/JMX/Arthas | `internal/jvm`, `tools/jmx-helper` | `internal/jvm/*_test.go` |
| 导入导出、备份、审计 | `internal/app`, `internal/cloudbackup`, `internal/sqlaudit`, 对应前端组件 | 对应目录测试 |
| 构建、发布、驱动代理 | `wails.json`, `.github/workflows`, `build*.sh`, `tools/` | `tools/*test*`, 对应 Go 构建测试 |

先读目标文件和测试，再搜索调用方；不要从 `frontend/src/App.tsx` 或 `internal/app/app.go` 开始无差别展开全部依赖。


