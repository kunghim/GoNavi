## 背景与问题

DataGrid 列支持拖拽调整宽度，但原有最小宽度不足以容纳字段标题、筛选器、排序器和列宽拖拽手柄。

对于 `limit_up_price` 等长字段名，Ant Design 标题容器会保留内容最小宽度，将筛选器和排序器推到表头边界外，并被 `overflow: hidden` 裁剪；部分较短字段的排序器也会与拖拽手柄重叠。

## 变更点

- 将普通数据列的统一最小宽度设为 120px。
- 让默认宽度、手动拖拽和自动适配共用同一最小宽度约束。
- 允许字段标题及 Ant Design 排序容器在长字段名下正确收缩。
- 固定筛选器和排序器的操作空间，并为列宽拖拽手柄预留右侧区域。
- 补充最小列宽和标题收缩行为的回归测试。

## 影响范围

- DataGrid V2 列头布局。
- 普通数据列的默认、手动调整和自动适配宽度。
- 不涉及后端接口、数据库数据或存储格式变更。

较窄密度下普通数据列的最小宽度会统一为 120px，可能增加横向滚动距离，但可以保证筛选和排序入口始终可用。

## 验证方式

- `npx vitest run src/utils/dataGridDisplay.test.ts src/components/useDataGridColumnResize.interaction.test.tsx src/components/DataGridColumnTitle.test.tsx`
  - 3 个测试文件通过。
  - 20 项测试通过。
- 在开发复现页将 `price`、`limit_up_price`、`at_limit` 拖至 120px，筛选器和排序器均保持可见，且不与拖拽手柄重叠。
- Windows AMD64 Wails 正式构建通过。

## 风险与回滚

- 风险主要是最小列宽增大带来的额外横向滚动。
- 如需回滚，可直接撤销本 PR 的单一提交，不涉及数据迁移。


