import React, { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import DataGridResultViewSwitcher from '../../components/DataGridResultViewSwitcher';
import DataGridColumnQuickFind from '../../components/DataGridColumnQuickFind';
import DataGridPaginationBar from '../../components/DataGridPaginationBar';
import DataGridErDiagram from '../../components/DataGridErDiagram';
import { DataGridJsonView } from '../../components/DataGridRecordViews';
import type { GridViewMode } from '../../components/dataGrid/core/dataGridTypes';
import { useI18n } from '../../i18n/provider';
import type { I18nParams } from '../../i18n/types';
import { useStore } from '../../store';
import { useSampleText } from '../sampleText';
import type { GallerySectionDef } from '../galleryRegistry';

const SAMPLE_ROWS = [
  { id: 1, region: 'apac', orders: 1284, revenue: 51230.5, created_at: '2026-03-01 09:12:00' },
  { id: 2, region: 'emea', orders: 942, revenue: 40188.25, created_at: '2026-03-01 10:41:00' },
  { id: 3, region: 'amer', orders: 1631, revenue: 68812.9, created_at: '2026-03-01 11:05:00' },
  { id: 4, region: 'apac', orders: 1187, revenue: 47310.0, created_at: '2026-03-01 12:33:00' },
];

// 列名是技术标识符（字段名），保持原样不翻译。
const COLUMNS: ColumnsType<typeof SAMPLE_ROWS[number]> = [
  { title: 'id', dataIndex: 'id', width: 70 },
  { title: 'region', dataIndex: 'region', width: 120 },
  { title: 'orders', dataIndex: 'orders', width: 100, align: 'right' },
  { title: 'revenue', dataIndex: 'revenue', width: 130, align: 'right' },
  { title: 'created_at', dataIndex: 'created_at' },
];

const ViewSwitcherRow: React.FC = () => {
  const [viewMode, setViewMode] = useState<GridViewMode>('table');
  return (
    <div className="gn-v2-data-grid">
      <DataGridResultViewSwitcher
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );
};

const QuickFindRow: React.FC = () => {
  const [value, setValue] = useState('');
  const s = useSampleText();
  return (
    <div style={{ width: 280 }}>
      <DataGridColumnQuickFind
        value={value}
        onChange={setValue}
        onSubmit={() => undefined}
        options={[
          { value: 'id', comment: s.primaryKey },
          { value: 'region', comment: s.partitionKey },
          { value: 'orders', comment: s.dailyOrderCount },
          { value: 'revenue', comment: s.revenueAmount },
        ]}
      />
    </div>
  );
};

const PaginationRow: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="gn-v2-data-grid" style={{ width: 420 }}>
      <DataGridPaginationBar
        pagination={{ current: 2, pageSize: 20, total: 320 }}
        selectedRowCount={3}
        paginationV2SummaryText={t('data_grid.pagination.summary.known', { current: 20, total: 320 })}
        paginationTotalPages={16}
        paginationPageText="2 / 16"
        paginationPageSizeOptions={['20', '50', '100']}
        showKnownPageCount
        onPageChange={() => undefined}
        onPageSizeChange={() => undefined}
        onV2PageStep={() => undefined}
      />
    </div>
  );
};

const ResultTableRow: React.FC = () => (
  <div className="gn-v2-data-grid" style={{ width: '100%' }}>
    <Table
      size="small"
      rowKey="id"
      columns={COLUMNS}
      dataSource={SAMPLE_ROWS}
      pagination={false}
    />
  </div>
);

const JsonViewRow: React.FC = () => (
  <div className="gn-v2-data-grid" style={{ width: 360 }}>
    <DataGridJsonView
      darkMode={false}
      rowCount={4}
      canModifyData={false}
      jsonViewText={JSON.stringify(SAMPLE_ROWS, null, 2)}
      onOpenJsonEditor={() => undefined}
      onReturnToTable={() => undefined}
    />
  </div>
);

// ER 图从 store 读连接，用画廊种子里的 MySQL 连接喂 browserMock 的表/列/外键数据。
// 组件内部靠 flex 继承高度（画布是 flex:1），所以外层必须是 flex 容器，
// 否则 react-flow 容器高度为 0，节点不会渲染。
const ErDiagramRow: React.FC = () => {
  const { t } = useI18n();
  const connections = useStore((state) => state.connections);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 460 }}>
      <DataGridErDiagram
        connections={connections}
        connectionId="gallery-mysql"
        dbName="analytics"
        tableName="videos"
        translate={(key: string, params?: I18nParams) => t(key, params)}
        onOpenTable={() => undefined}
      />
    </div>
  );
};

export const dataSection: GallerySectionDef = {
  id: 'data',
  group: 'project',
  titleKey: 'gallery.section.data.title',
  descKey: 'gallery.section.data.desc',
  items: [
    {
      id: 'data-result-view-switcher',
      name: 'DataGridResultViewSwitcher',
      source: 'components/DataGridResultViewSwitcher.tsx',
      render: () => <ViewSwitcherRow />,
    },
    {
      id: 'data-column-quick-find',
      name: 'DataGridColumnQuickFind',
      source: 'components/DataGridColumnQuickFind.tsx',
      render: () => <QuickFindRow />,
    },
    {
      id: 'data-pagination-bar',
      name: 'DataGridPaginationBar',
      source: 'components/DataGridPaginationBar.tsx',
      render: () => <PaginationRow />,
    },
    {
      id: 'data-result-table',
      name: 'Result Table',
      source: 'styles/v2Theme/v2-theme-10-v2-datagrid.css',
      render: () => <ResultTableRow />,
    },
    {
      id: 'data-json-view',
      name: 'DataGridJsonView',
      source: 'components/DataGridRecordViews.tsx',
      render: () => <JsonViewRow />,
    },
    {
      id: 'data-er-diagram',
      name: 'DataGridErDiagram',
      source: 'components/DataGridErDiagram.tsx',
      wide: true,
      render: () => <ErDiagramRow />,
    },
  ],
};
