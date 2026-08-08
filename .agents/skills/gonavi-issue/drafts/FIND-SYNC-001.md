# [Enhancement] 差异同步支持复合主键表

## 来源与验证状态

- 来源：`gonavi-scan`
- 发现 ID：FIND-SYNC-001
- 类型：产品能力缺口
- 严重度：P2
- 验证状态：已验证（代码与自动化测试）
- 关联能力：`CAP-SYNC-001`

## 目标用户

使用 `tenant_id + user_id` 等联合业务键建模，并需要在源表与目标表之间执行差异预览或增量同步的数据库使用者。

## 使用场景

用户为源表和目标表配置相同的复合主键，在数据同步工作台选择差异同步或差异预览，希望系统以全部主键列唯一定位每一行，并给出新增、更新和删除差异。

## 现状与痛点

当前表到表和 SQL 结果到表的差异同步只接受单列主键。无主键或复合主键会被拒绝或跳过，导致使用联合业务键的表无法完成差异预览与增量同步闭环。用户只能改用直接导入、调整表结构或使用其他同步方式，失去差异对比能力。

## 期望的功能

将复合主键值作为有序元组处理，在表到表与 SQL 结果到表的差异同步中统一支持多列主键的分页、反查、差异集合与行选择逻辑；能够正确生成新增、更新和删除差异，并将变更应用到目标表。

## 当前行为与证据

- `internal/sync/analyze.go:191`、`internal/sync/preview.go:103`、`internal/sync/source_query_sync.go:82` 和 `internal/sync/sync_engine.go:326` 的单列主键解析路径会拒绝或跳过复合主键。
- `internal/sync/analyze_i18n_test.go:294`、`internal/sync/preview_i18n_test.go:188`、`internal/sync/source_query_sync_test.go:262` 明确断言复合主键错误路径。
- 以下自动化验证已通过：

```powershell
go test ./internal/sync -run "TestAnalyzeUsesCurrentLanguageForReadAndPKMessages|TestPreviewUsesCurrentLanguageForPreflightErrors|TestResolveSinglePKColumnUsesCurrentLanguageForQueryDiffErrors" -count=1
```

扫描记录结果：`PASS`，`ok GoNavi-Wails/internal/sync 5.564s`。

## 验收标准

1. 源表和目标表均以两个或更多字段组成复合主键时，差异分析和差异预览不再返回“复合主键当前暂不支持”错误。
2. 系统使用全部主键字段唯一定位行，正确生成新增、更新和删除差异，且不会将不同联合键误判为同一行。
3. 表到表与 SQL 结果到表两条同步路径均支持复合主键。
4. 为 MySQL-like、PostgreSQL-like 方言补充自动化覆盖；如 Driver Agent 路径支持该流程，也应覆盖该路径。
5. 单列主键、无主键拒绝逻辑及现有差异同步行为保持兼容。

## 兼容性影响

该能力扩展仅改变此前被拒绝的复合主键表的可用范围。单列主键表应保持现有差异语义；无主键表仍应保留明确的限制提示。

## 验证边界

本发现已由代码路径和自动化测试验证。尚未在全部数据库方言、数据量规模及可选 Driver Agent 环境完成端到端验证；实现后应按验收标准补充真实连接验证。

---
来源：`gonavi-scan`
发现 ID：FIND-SYNC-001
提交方式：AI 辅助整理，人工确认后提交
验证状态：已验证（代码与自动化测试）
