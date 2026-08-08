# GoNavi 增量验证报告

- 模式：外部服务验证（针对既有发现，不改变代码基线）
- 日期：2026-08-08
- 验证对象：`FIND-MSG-001` 的 RabbitMQ 行为
- 连接实例：`rabbitmq-management`（`connections.local.yaml`，凭据未写入本报告）
- Issue：[`Syngnat/GoNavi#881`](https://github.com/Syngnat/GoNavi/issues/881)（OPEN）
- 纳入范围：RabbitMQ Management API、`RabbitMQDB.GetColumns` 等价取样请求
- 排除范围：生产代码、正式 UI 流程、其他消息服务

## 验证结果

### FIND-MSG-001 RabbitMQ 字段元数据读取会取样实际消息

- 验证状态：已验证（真实 RabbitMQ 3.13.7 Management API）
- 实现证据：`internal/db/rabbitmq_impl.go:383-433`；`internal/db/rabbitmq_impl.go:821-837`
- 关键实现：`GetColumns` 调用 `/api/queues/{vhost}/{queue}/get`，请求体使用 `count=20`、`ackmode=ack_requeue_true`、`encoding=auto`、`truncate=50000`。

验证路径：

1. 从本机私有连接清单读取 `rabbitmq-management`，连接 RabbitMQ Management API；未在输出中打印用户名、密码或 Token。
2. 创建临时自动删除队列，并通过 `amq.default` 发布 3 条带序号消息 `codex-msg-1` 至 `codex-msg-3`。
3. 记录队列状态后，发送与 `GetColumns` 完全相同的取样请求。
4. 再次发送同一取样请求，观察返回行的 `redelivered` 字段。
5. 删除临时队列。

预期结果：若 `ack_requeue_true` 会重新放回取样消息，第一次取样应返回未重投递消息，第二次取样应再次返回同一批消息且 `redelivered=true`。

实际结果：

- Management API 响应 HTTP 200；服务版本 `3.13.7`。
- 第一次取样返回 3 条，`redelivered=false,false,false`。
- 第二次取样返回 3 条，`redelivered=true,true,true`。
- 临时队列已删除；未修改仓库或持久化业务数据。

结论：打开 RabbitMQ 队列的字段元数据会真实读取消息，并通过 `ack_requeue_true` 将消息重新放回队列；重复取样会产生 `redelivered` 标记。因此报告中关于 RabbitMQ 读取副作用的结论得到真实运行时验证。该验证覆盖后端等价请求，不代表已完成 GoNavi 桌面 UI 的完整点击流程。

## 验证边界

- 原有共享队列 `dbx_smoke` 当时为空，因此本次使用临时队列构造了可控样本。
- 本次未观察真实业务队列的顺序扰动，只验证了消息取样、重新入队和 `redelivered` 标记。
