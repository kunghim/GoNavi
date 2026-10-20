import React from 'react';
import ResultChartCanvas from '../../components/dataGrid/chart/ResultChartCanvas';
import type { ResultChartType } from '../../components/dataGrid/chart/resultChartTypes';
import ExplainGraph from '../../components/explain/ExplainGraph';
import ExplainHotspotStrip from '../../components/explain/ExplainHotspotStrip';
import type { ExplainEdge, ExplainNode } from '../../utils/explainTypes';
import { useI18n } from '../../i18n/provider';
import type { GallerySectionDef } from '../galleryRegistry';

const CHART_POINTS = [
  { x: '2026-03-01', value: 182 },
  { x: '2026-03-02', value: 241 },
  { x: '2026-03-03', value: 198 },
  { x: '2026-03-04', value: 276 },
  { x: '2026-03-05', value: 312 },
  { x: '2026-03-06', value: 265 },
  { x: '2026-03-07', value: 358 },
];

const EXPLAIN_NODES: ExplainNode[] = [
  {
    id: 'n1',
    opType: 'AGGREGATE',
    opDetail: 'GROUP BY',
    table: 'events',
    estRows: 1200,
    cost: 12.5,
    costShare: 0.45,
  },
  {
    id: 'n2',
    parentId: 'n1',
    opType: 'SCAN',
    opDetail: 'Seq Scan',
    table: 'events',
    estRows: 48_000,
    cost: 9.2,
    costShare: 0.38,
  },
  {
    id: 'n3',
    parentId: 'n1',
    opType: 'FILTER',
    opDetail: 'Filter',
    table: 'events',
    estRows: 1200,
    cost: 3.3,
    costShare: 0.12,
  },
];

const EXPLAIN_EDGES: ExplainEdge[] = [
  { from: 'n2', to: 'n1' },
  { from: 'n3', to: 'n1' },
];

const ChartRow: React.FC = () => {
  const { t } = useI18n();
  const type: ResultChartType = 'bar';
  return (
    <div style={{ width: 420, height: 220 }}>
      <ResultChartCanvas
        type={type}
        darkMode={false}
        translate={(key: string, params?: Record<string, string | number>) => t(key, params)}
        data={{
          points: CHART_POINTS,
          series: [{ key: 'value', label: 'orders' }],
          xKind: 'category',
          truncated: false,
          skippedRows: 0,
        }}
      />
    </div>
  );
};

const ExplainRow: React.FC = () => (
  <div style={{ width: 520, height: 300 }}>
    <ExplainGraph nodes={EXPLAIN_NODES} edges={EXPLAIN_EDGES} direction="TB" />
  </div>
);

const HotspotRow: React.FC = () => (
  <div style={{ width: 520 }}>
    <ExplainHotspotStrip
      nodes={EXPLAIN_NODES}
      basis="cost"
      selectedNodeId={null}
      onSelectNode={() => undefined}
    />
  </div>
);

export const visualizationSection: GallerySectionDef = {
  id: 'visualization',
  group: 'project',
  titleKey: 'gallery.section.visualization.title',
  descKey: 'gallery.section.visualization.desc',
  items: [
    {
      id: 'visualization-result-chart',
      name: 'ResultChartCanvas',
      source: 'components/dataGrid/chart/ResultChartCanvas.tsx',
      render: () => <ChartRow />,
    },
    {
      id: 'visualization-explain-graph',
      name: 'ExplainGraph',
      source: 'components/explain/ExplainGraph.tsx',
      render: () => <ExplainRow />,
    },
    {
      id: 'visualization-explain-hotspot',
      name: 'ExplainHotspotStrip',
      source: 'components/explain/ExplainHotspotStrip.tsx',
      render: () => <HotspotRow />,
    },
  ],
};
