import React, { useState } from 'react';
import { Card, Checkbox, Descriptions, List, Statistic, Table, Timeline, Transfer } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { DescriptionsProps } from 'antd/es/descriptions';
import type { TransferKey } from 'antd/es/transfer/interface';
import { useSampleText } from '../../sampleText';
import type { GallerySectionDef } from '../../galleryRegistry';

// 通用数据展示组件样例。
// 字段名、区域码、连接名、货币码都是技术字面量，保持原样不翻译。
// 变体标签用 antd 的属性名或组件名（default / bordered / split / loading 等），同样属于技术字面量。

type OrderRow = {
  id: number;
  region: string;
  orders: number;
  revenue: number;
  created_at: string;
};

const ORDER_ROWS: OrderRow[] = [
  { id: 1, region: 'apac', orders: 1284, revenue: 51230.5, created_at: '2026-03-01 09:12:00' },
  { id: 2, region: 'emea', orders: 942, revenue: 40188.25, created_at: '2026-03-01 10:41:00' },
  { id: 3, region: 'amer', orders: 1631, revenue: 68812.9, created_at: '2026-03-01 11:05:00' },
  { id: 4, region: 'apac', orders: 1187, revenue: 47310, created_at: '2026-03-01 12:33:00' },
  { id: 5, region: 'emea', orders: 760, revenue: 31902.75, created_at: '2026-03-01 13:20:00' },
  { id: 6, region: 'amer', orders: 1455, revenue: 61204.4, created_at: '2026-03-01 14:02:00' },
];

const REGION_CODES = ['apac', 'emea', 'amer'];

type ConnectionItem = {
  key: string;
  title: string;
};

const CONNECTION_ITEMS: ConnectionItem[] = [
  { key: 'prod-mysql', title: 'prod-mysql' },
  { key: 'staging-pg', title: 'staging-pg' },
  { key: 'analytics-clickhouse', title: 'analytics-clickhouse' },
  { key: 'local-sqlite', title: 'local-sqlite' },
  { key: 'backup-mariadb', title: 'backup-mariadb' },
];

// 表格：选择、排序、筛选、展开行、合计行一起演示。
const TableDemo: React.FC = () => {
  const s = useSampleText();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 区域列的自定义筛选面板：标题走 i18n，勾选后立即生效。
  const renderRegionFilter = (props: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <div className="gonavi-component-gallery-label" style={{ marginBottom: 6 }}>
        {s.tableFilterRegion}
      </div>
      {REGION_CODES.map((code) => (
        <div key={code}>
          <Checkbox
            checked={props.selectedKeys.includes(code)}
            onChange={(event) => {
              const next = event.target.checked
                ? [...props.selectedKeys, code]
                : props.selectedKeys.filter((key) => key !== code);
              props.setSelectedKeys(next);
              props.confirm({ closeDropdown: false });
            }}
          >
            {code}
          </Checkbox>
        </div>
      ))}
    </div>
  );

  const columns: ColumnsType<OrderRow> = [
    { title: 'id', dataIndex: 'id', width: 80 },
    {
      title: 'region',
      dataIndex: 'region',
      width: 140,
      filters: REGION_CODES.map((code) => ({ text: code, value: code })),
      onFilter: (value, record) => record.region === value,
      filterDropdown: renderRegionFilter,
    },
    {
      title: 'orders',
      dataIndex: 'orders',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.orders - b.orders,
    },
    { title: 'revenue', dataIndex: 'revenue', width: 140, align: 'right' },
    { title: 'created_at', dataIndex: 'created_at', width: 200 },
  ];

  const totalOrders = ORDER_ROWS.reduce((sum, row) => sum + row.orders, 0);

  return (
    <Table<OrderRow>
      size="small"
      bordered
      rowKey="id"
      columns={columns}
      dataSource={ORDER_ROWS}
      scroll={{ x: 720 }}
      pagination={false}
      locale={{ filterTitle: s.tableFilterRegion }}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
      }}
      expandable={{
        expandedRowRender: (record) => <div>{s.tableExpand}</div>,
        rowExpandable: (record) => record.orders > 1000,
      }}
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              {s.tableSummary}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="right">
              {totalOrders}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
};

// 列表：四种外观变体。
const ListDemo: React.FC = () => {
  const s = useSampleText();
  const items = CONNECTION_ITEMS.slice(0, 3).map((item) => ({
    key: item.key,
    title: s.listTitle,
    description: s.listDesc,
    extra: item.key,
  }));

  const renderItem = (item: (typeof items)[number]) => (
    <List.Item key={item.key} extra={item.extra}>
      <List.Item.Meta title={item.title} description={item.description} />
    </List.Item>
  );

  return (
    <div className="gonavi-component-gallery-stack">
      <div>
        <div className="gonavi-component-gallery-label">default</div>
        <List size="small" dataSource={items} renderItem={renderItem} />
      </div>
      <div>
        <div className="gonavi-component-gallery-label">bordered</div>
        <List size="small" bordered dataSource={items} renderItem={renderItem} />
      </div>
      <div>
        <div className="gonavi-component-gallery-label">split</div>
        <List size="small" split dataSource={items} renderItem={renderItem} />
      </div>
      <div>
        <div className="gonavi-component-gallery-label">loading</div>
        <List size="small" loading dataSource={items} renderItem={renderItem} />
      </div>
    </div>
  );
};

// 统计：普通统计、倒计时、带前后缀、卡片内统计。
const StatisticDemo: React.FC = () => {
  const s = useSampleText();
  const [countdownTarget] = useState(() => Date.now() + 90 * 1000);

  return (
    <div className="gonavi-component-gallery-stack">
      <div className="gonavi-component-gallery-row">
        <Statistic title={s.statisticTotal} value={128490} />
        <Statistic
          title={s.statisticConversion}
          value={0.683}
          precision={2}
          prefix="↑"
          suffix="%"
        />
      </div>
      <div className="gonavi-component-gallery-row">
        <div>
          <div className="gonavi-component-gallery-label">Countdown</div>
          <Statistic.Countdown value={countdownTarget} format="HH:mm:ss" />
        </div>
        <Card size="small" style={{ minWidth: 220 }}>
          <Statistic
            title={s.statisticTotal}
            value={51230.5}
            precision={2}
            prefix="$"
            suffix="USD"
          />
        </Card>
      </div>
    </div>
  );
};

// 时间线：彩色节点、待办节点、左右交替布局。
const TimelineDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <div>
        <div className="gonavi-component-gallery-label">items + pending</div>
        <Timeline
          items={[
            { color: 'blue', children: s.timelineConnect },
            { color: 'green', children: s.timelineExecute },
            { color: 'red', children: s.timelineReturn },
          ]}
          pending={<div>{s.pending}</div>}
        />
      </div>
      <div>
        <div className="gonavi-component-gallery-label">mode="alternate"</div>
        <Timeline
          mode="alternate"
          items={[
            { color: 'blue', children: s.timelineConnect },
            { color: 'green', children: s.timelineExecute },
            { color: 'gray', children: s.timelineReturn },
          ]}
        />
      </div>
    </div>
  );
};

// 穿梭框：连接在可用与已选之间移动。
const TransferDemo: React.FC = () => {
  const s = useSampleText();
  const [targetKeys, setTargetKeys] = useState<TransferKey[]>(['staging-pg']);

  return (
    <div className="gonavi-component-gallery-stack">
      <Transfer
        dataSource={CONNECTION_ITEMS}
        targetKeys={targetKeys}
        onChange={(nextTargetKeys) => setTargetKeys(nextTargetKeys)}
        titles={[s.transferAvailable, s.transferSelected]}
        showSearch
        render={(item) => item.title}
        listStyle={{ width: 200, height: 240 }}
      />
    </div>
  );
};

// 描述列表：带边框布局、响应式列数、跨列字段。
const DescriptionsDemo: React.FC = () => {
  const s = useSampleText();
  const borderedItems: DescriptionsProps['items'] = [
    { key: 'primary', label: s.primaryKey, children: 'id', span: 1 },
    { key: 'partition', label: s.partitionKey, children: 'region', span: 1 },
    { key: 'orders', label: s.dailyOrderCount, children: '1284', span: 1 },
    { key: 'revenue', label: s.revenueAmount, children: '51230.50', span: 3 },
  ];
  const responsiveItems: DescriptionsProps['items'] = [
    { key: 'primary', label: s.primaryKey, children: 'id' },
    { key: 'partition', label: s.partitionKey, children: 'region' },
    { key: 'orders', label: s.dailyOrderCount, children: '1284' },
    { key: 'revenue', label: s.revenueAmount, children: '51230.50' },
  ];

  return (
    <div className="gonavi-component-gallery-stack">
      <div>
        <div className="gonavi-component-gallery-label">bordered + span</div>
        <Descriptions bordered size="small" column={3} items={borderedItems} />
      </div>
      <div>
        <div className="gonavi-component-gallery-label">column</div>
        <Descriptions size="small" column={{ xs: 1, sm: 2, md: 3 }} items={responsiveItems} />
      </div>
    </div>
  );
};

export const commonDataSection: GallerySectionDef = {
  id: 'common-data',
  group: 'common',
  titleKey: 'gallery.section.common-data.title',
  descKey: 'gallery.section.common-data.desc',
  items: [
    {
      id: 'common-data-table',
      name: 'Table',
      source: 'antd 5',
      wide: true,
      render: () => <TableDemo />,
    },
    {
      id: 'common-data-list',
      name: 'List',
      source: 'antd 5',
      render: () => <ListDemo />,
    },
    {
      id: 'common-data-statistic',
      name: 'Statistic',
      source: 'antd 5',
      render: () => <StatisticDemo />,
    },
    {
      id: 'common-data-timeline',
      name: 'Timeline',
      source: 'antd 5',
      render: () => <TimelineDemo />,
    },
    {
      id: 'common-data-transfer',
      name: 'Transfer',
      source: 'antd 5',
      render: () => <TransferDemo />,
    },
    {
      id: 'common-data-descriptions',
      name: 'Descriptions',
      source: 'antd 5',
      render: () => <DescriptionsDemo />,
    },
  ],
};
