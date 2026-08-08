## 来源与发现

- 来源：`.agents/skills/gonavi-scan/reports/2026-08-07-full.md`
- 发现 ID：`FIND-SYNC-002`
- 类型：产品能力缺口
- 严重度：P2
- 置信度：高
- 验证状态：已验证（自动化测试）
- 关联能力：`CAP-SYNC-A03`、`CAP-DS-TDENGINE`、`CAP-DS-IOTDB`

## 目标用户

需要把关系型或查询结果同步到 TDengine / IoTDB 等时序目标，并期望目标端与源端保持差异一致的用户。

## 场景与现状痛点

当同步目标为 TDengine 或 IoTDB 时，`ApplyChanges` 仅接受新增行；只要变更集合包含 UPDATE 或 DELETE 就拒绝执行。因此，用户在“差异同步”语义下无法把源端记录的修改或删除同步到时序目标，只能完成追加式迁移。

如果产品当前只计划支持追加写入，用户需要在选择目标和同步模式时提前看到能力边界，而不是等到应用差异阶段才发现 UPDATE / DELETE 无法落地。

## 前置条件

1. 准备一张源表。
2. 准备一个 TDengine 或 IoTDB 目标，并确保目标中已有对应历史记录。
3. 让源记录相对目标发生更新或删除差异。

## 最小复现步骤

1. 进入数据同步工作台。
2. 选择源表与 TDengine 或 IoTDB 目标。
3. 选择差异同步模式并生成差异。
4. 让差异集合中包含 UPDATE 或 DELETE。
5. 应用差异。

## 期望行为

如果产品承诺对 TDengine / IoTDB 支持通用差异同步，应能把 UPDATE / DELETE 应用到目标端。

如果当前能力只支持追加写入，应在分析阶段或模式选择阶段禁用不支持的差异模式，并明确展示“仅 INSERT / 仅追加”的能力边界。

## 实际行为

迁移计划会给出仅 INSERT 警告，`ApplyChanges` 拒绝包含 UPDATE 或 DELETE 的变更集合，且不会部分写入。因此 TDengine / IoTDB 目标无法完成通用差异同步闭环。

## 代码与测试证据

- `internal/db/tdengine_impl.go:432`
- `internal/db/iotdb_impl.go:420`
- `internal/sync/schema_migration_test.go:886`
- `internal/sync/schema_migration_test.go:923`

本次验证命令：

```powershell
go test -tags gonavi_tdengine_driver ./internal/db -run "TestTDengineApplyChanges_RejectsMixedUpdatesWithoutPartialWrite" -count=1 -v
go test -tags gonavi_iotdb_driver ./internal/db -run "TestIoTDBApplyChangesBuildsInsertAndRejectsMutatingDiffs" -count=1 -v
go test ./internal/sync -run "TestBuildSchemaMigrationPlan_TDengineTargetWarnsInsertOnlyBoundary|TestBuildSchemaMigrationPlan_IoTDBTargetWarnsInsertOnlyBoundary" -count=1 -v
```

本次结果：三组测试均 `PASS`；TDengine 与 IoTDB 驱动测试分别使用对应 build tag，确认测试确实执行。

## 影响

用户若把“差异同步”理解为源目标一致，目标端旧记录修改或删除将无法落地；系统虽会警告或拒绝，但同步任务目标不能完成，容易造成对时序目标能力的误解。

## 建议方向

1. 在目标选择、模式选择或分析阶段展示 TDengine / IoTDB 的能力矩阵，将当前能力明确标记为“仅追加”。
2. 对包含 UPDATE / DELETE 的差异任务提前阻断，并提供可操作说明。
3. 后续若实现变更语义，应分别按时间戳、设备主键和时序数据库约束设计 TDengine 与 IoTDB 的更新删除策略。

## 验收标准

1. TDengine / IoTDB 作为目标时，用户能在应用差异前明确看到是否仅支持 INSERT。
2. 包含 UPDATE / DELETE 的差异集合不会进入会产生误解的执行路径。
3. 若继续保持仅追加能力，UI 与同步计划均明确说明该边界。
4. 若实现 UPDATE / DELETE 支持，应增加 TDengine 与 IoTDB 各自的单元测试或集成测试，覆盖更新、删除、混合集合和失败不部分写入。

## 兼容性影响

短期若只补充能力边界提示，不改变现有写入语义；已有 INSERT-only 同步行为应保持兼容。若后续实现 UPDATE / DELETE，需要按 TDengine 与 IoTDB 的数据模型分别评估历史数据覆盖、删除语义和时间序列主键定位策略。

## 验证边界

当前验证来自自动化测试与代码证据，未连接真实 TDengine / IoTDB 服务执行端到端同步。真实环境下还需补充目标版本、权限、时间戳/设备维度建模和删除策略验证。

---
来源：gonavi-scan
发现 ID：FIND-SYNC-002
提交方式：AI 辅助整理，人工确认后提交
验证状态：已验证
