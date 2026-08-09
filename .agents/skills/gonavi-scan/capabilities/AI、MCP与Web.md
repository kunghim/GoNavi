# AI、MCP 与 Web

> scan_id: `full-20260809-cf35d633`
> head_commit: `cf35d6330d5f760867cc9524467b69eff405e684`

> 本文件是 gonavi-scan 功能地图的领域分册。能力 ID 保持稳定；扫描时只更新受影响领域。

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
