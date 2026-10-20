import React from 'react';
import type { CSSProperties } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart, LabelList,
  Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar,
  RadarChart, RadialBar, RadialBarChart, Rectangle, ResponsiveContainer, Scatter, ScatterChart,
  Tooltip, Treemap, XAxis, YAxis, ZAxis,
} from 'recharts';
import type { PieLabelRenderProps, TreemapNode } from 'recharts';
import { useSampleText } from '../../sampleText';
import type { GallerySectionDef } from '../../galleryRegistry';

// 图表配色一律用主题变量：画廊切换 17 套主题时，图表跟着一起换色。
const SERIES_COLORS = [
  'var(--gn-accent)',
  'var(--gn-info)',
  'var(--gn-warn)',
  'var(--gn-danger)',
  'var(--gn-purple, var(--gn-info))',
];

const TICK = { fill: 'var(--gn-fg-4)', fontSize: 11 };
const GRID_STROKE = 'var(--gn-br-2)';
const AXIS_STROKE = 'var(--gn-br-3)';
const PANEL_STROKE = 'var(--gn-bg-panel)';

const TOOLTIP_CONTENT: CSSProperties = {
  background: 'var(--gn-bg-panel-2)',
  border: '1px solid var(--gn-br-2)',
  borderRadius: 8,
  color: 'var(--gn-fg-2)',
  fontSize: 12,
};
const TOOLTIP_ITEM: CSSProperties = { color: 'var(--gn-fg-2)' };
const TOOLTIP_LABEL: CSSProperties = { color: 'var(--gn-fg-1)' };
const LEGEND_LABEL: CSSProperties = { color: 'var(--gn-fg-3)' };
const LEGEND_WRAPPER: CSSProperties = { fontSize: 12 };

const cartesianTooltip = (
  <Tooltip
    contentStyle={TOOLTIP_CONTENT}
    itemStyle={TOOLTIP_ITEM}
    labelStyle={TOOLTIP_LABEL}
    cursor={{ stroke: AXIS_STROKE, strokeDasharray: '3 3' }}
  />
);

const plainTooltip = (
  <Tooltip contentStyle={TOOLTIP_CONTENT} itemStyle={TOOLTIP_ITEM} labelStyle={TOOLTIP_LABEL} />
);

const legendNode = (
  <Legend iconSize={8} labelStyle={LEGEND_LABEL} wrapperStyle={LEGEND_WRAPPER} />
);

// 三个笛卡尔图共用同一套坐标轴与网格。
const dailyAxes = (
  <>
    <CartesianGrid stroke={GRID_STROKE} vertical={false} />
    <XAxis dataKey="date" tick={TICK} stroke={AXIS_STROKE} />
    <YAxis tick={TICK} stroke={AXIS_STROKE} width={48} />
  </>
);

const SMALL_BOX: CSSProperties = { width: 320, height: 220 };
const WIDE_BOX: CSSProperties = { width: '100%', height: 240 };

// 样例数据：日期与区域码是技术字面量，不翻译。
const DAILY_ROWS = [
  { date: '2026-03-01', orders: 182, revenue: 940 },
  { date: '2026-03-02', orders: 241, revenue: 1120 },
  { date: '2026-03-03', orders: 198, revenue: 1030 },
  { date: '2026-03-04', orders: 276, revenue: 1280 },
  { date: '2026-03-05', orders: 312, revenue: 1410 },
  { date: '2026-03-06', orders: 265, revenue: 1350 },
  { date: '2026-03-07', orders: 358, revenue: 1590 },
];

const REGION_SHARE = [
  { region: 'apac', value: 46 },
  { region: 'emea', value: 31 },
  { region: 'amer', value: 23 },
];

const RADAR_ROWS = [
  { region: 'apac', orders: 320, revenue: 1420 },
  { region: 'emea', orders: 268, revenue: 1180 },
  { region: 'amer', orders: 384, revenue: 1630 },
  { region: 'latam', orders: 176, revenue: 760 },
];

const SCATTER_ROWS = [
  { x: 12, y: 34, z: 180 }, { x: 18, y: 46, z: 320 }, { x: 24, y: 28, z: 120 }, { x: 31, y: 52, z: 260 },
  { x: 37, y: 41, z: 200 }, { x: 44, y: 63, z: 360 }, { x: 52, y: 49, z: 240 }, { x: 61, y: 71, z: 300 },
];

const RADIAL_ROWS = [
  { region: 'apac', value: 82 },
  { region: 'emea', value: 64 },
  { region: 'amer', value: 91 },
];

const TREE_ROWS = [
  { name: 'apac', size: 1800, children: [
    { name: 'apac-1', size: 980, color: 'var(--gn-accent)' },
    { name: 'apac-2', size: 520, color: 'var(--gn-info)' },
    { name: 'apac-3', size: 300, color: 'var(--gn-warn)' },
  ] },
  { name: 'emea', size: 1150, children: [
    { name: 'emea-1', size: 700, color: 'var(--gn-danger)' },
    { name: 'emea-2', size: 450, color: 'var(--gn-accent)' },
  ] },
  { name: 'amer', size: 900, children: [
    { name: 'amer-1', size: 560, color: 'var(--gn-info)' },
    { name: 'amer-2', size: 340, color: 'var(--gn-warn)' },
  ] },
];

const renderSliceLabel = (props: PieLabelRenderProps): React.ReactNode => (
  <text x={props.x} y={props.y} fill="var(--gn-fg-3)" fontSize={12} textAnchor="middle" dominantBaseline="middle">
    {props.name}
  </text>
);

// 矩形树图默认内容用固定色值，这里换成主题变量并补上名称文字。
const renderTreeNode = (node: TreemapNode): React.ReactElement => {
  if (node.depth === 0) {
    return <g />;
  }
  const isGroup = Boolean(node.children && node.children.length);
  const fill = isGroup
    ? 'var(--gn-bg-active)'
    : (typeof node.color === 'string' ? node.color : 'var(--gn-accent)');
  const textFill = isGroup ? 'var(--gn-fg-2)' : PANEL_STROKE;
  return (
    <g>
      <Rectangle x={node.x} y={node.y} width={node.width} height={node.height} fill={fill} stroke={PANEL_STROKE} strokeWidth={2} />
      {node.width > 56 && node.height > 22 ? (
        <text x={node.x + 8} y={node.y + node.height / 2 + 4} fontSize={12} fill={textFill}>
          {node.name}
        </text>
      ) : null}
    </g>
  );
};

const CartesianGallery: React.FC = () => {
  const s = useSampleText();
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <div style={SMALL_BOX}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DAILY_ROWS}>
            {dailyAxes}
            {cartesianTooltip}
            {legendNode}
            <Line type="linear" dataKey="orders" name={s.chartOrders} stroke={SERIES_COLORS[0]} strokeWidth={2} dot={{ r: 3, strokeWidth: 0, fill: SERIES_COLORS[0] }} isAnimationActive={false} />
            <Line type="linear" dataKey="revenue" name={s.chartRevenue} stroke={SERIES_COLORS[1]} strokeWidth={2} dot={{ r: 3, strokeWidth: 0, fill: SERIES_COLORS[1] }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={SMALL_BOX}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DAILY_ROWS}>
            {dailyAxes}
            {cartesianTooltip}
            {legendNode}
            <Area type="linear" dataKey="orders" name={s.chartOrders} stroke={SERIES_COLORS[0]} strokeWidth={2} fill={SERIES_COLORS[0]} fillOpacity={0.16} isAnimationActive={false} />
            <Area type="linear" dataKey="revenue" name={s.chartRevenue} stroke={SERIES_COLORS[1]} strokeWidth={2} fill={SERIES_COLORS[1]} fillOpacity={0.16} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={SMALL_BOX}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DAILY_ROWS}>
            {dailyAxes}
            {cartesianTooltip}
            {legendNode}
            <Bar dataKey="orders" name={s.chartOrders} fill={SERIES_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
            <Bar dataKey="revenue" name={s.chartRevenue} fill={SERIES_COLORS[1]} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ComposedSample: React.FC = () => {
  const s = useSampleText();
  const rows = [
    { period: s.day, orders: 182, revenue: 940 },
    { period: s.week, orders: 1240, revenue: 6120 },
    { period: s.month, orders: 5180, revenue: 27300 },
  ];
  return (
    <div style={WIDE_BOX}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="period" tick={TICK} stroke={AXIS_STROKE} />
          <YAxis yAxisId="left" tick={TICK} stroke={AXIS_STROKE} width={52} />
          <YAxis yAxisId="right" orientation="right" tick={TICK} stroke={AXIS_STROKE} width={52} />
          {cartesianTooltip}
          {legendNode}
          <Bar yAxisId="left" dataKey="orders" name={s.chartOrders} fill={SERIES_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={72} isAnimationActive={false} />
          <Line yAxisId="right" type="linear" dataKey="revenue" name={s.chartRevenue} stroke={SERIES_COLORS[1]} strokeWidth={2} dot={{ r: 3, strokeWidth: 0, fill: SERIES_COLORS[1] }} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const PieSample: React.FC = () => {
  const s = useSampleText();
  return (
    <div style={SMALL_BOX}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {plainTooltip}
          <Pie data={REGION_SHARE} dataKey="value" nameKey="region" name={s.chartShare} innerRadius="45%" outerRadius="78%" stroke={PANEL_STROKE} strokeWidth={2} isAnimationActive={false} label={renderSliceLabel}>
            {REGION_SHARE.map((row, index) => (
              <Cell key={row.region} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
            ))}
          </Pie>
          {legendNode}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const RadarSample: React.FC = () => {
  const s = useSampleText();
  return (
    <div style={SMALL_BOX}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={RADAR_ROWS}>
          <PolarGrid stroke={GRID_STROKE} />
          <PolarAngleAxis dataKey="region" tick={TICK} />
          <PolarRadiusAxis tick={TICK} stroke={AXIS_STROKE} />
          {plainTooltip}
          {legendNode}
          <Radar name={s.chartOrders} dataKey="orders" stroke={SERIES_COLORS[0]} fill={SERIES_COLORS[0]} fillOpacity={0.18} isAnimationActive={false} />
          <Radar name={s.chartRevenue} dataKey="revenue" stroke={SERIES_COLORS[1]} fill={SERIES_COLORS[1]} fillOpacity={0.12} isAnimationActive={false} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ScatterSample: React.FC = () => {
  const s = useSampleText();
  return (
    <div style={SMALL_BOX}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid stroke={GRID_STROKE} />
          <XAxis type="number" dataKey="x" tick={TICK} stroke={AXIS_STROKE} />
          <YAxis type="number" dataKey="y" tick={TICK} stroke={AXIS_STROKE} width={44} />
          <ZAxis type="number" dataKey="z" range={[60, 260]} />
          {cartesianTooltip}
          {legendNode}
          <Scatter name={s.chartOrders} data={SCATTER_ROWS} fill={SERIES_COLORS[0]} fillOpacity={0.7} isAnimationActive={false} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const RadialSample: React.FC = () => {
  const s = useSampleText();
  return (
    <div style={SMALL_BOX}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart data={RADIAL_ROWS} startAngle={90} endAngle={-270} innerRadius="22%" outerRadius="80%">
          {plainTooltip}
          <RadialBar dataKey="value" name={s.chartConversion} cornerRadius={4} background={{ fill: 'var(--gn-bg-active)' }} isAnimationActive={false}>
            {RADIAL_ROWS.map((row, index) => (
              <Cell key={row.region} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
            ))}
          </RadialBar>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TreemapSample: React.FC = () => (
  <div style={{ width: 420, height: 240 }}>
    <ResponsiveContainer width="100%" height="100%">
      <Treemap data={TREE_ROWS} dataKey="size" nameKey="name" type="flat" content={renderTreeNode} isAnimationActive={false} />
    </ResponsiveContainer>
  </div>
);

const FunnelSample: React.FC = () => {
  const s = useSampleText();
  const rows = [
    { name: s.chartOrders, value: 1000 },
    { name: s.chartRevenue, value: 640 },
    { name: s.chartConversion, value: 380 },
    { name: s.chartShare, value: 190 },
  ];
  return (
    <div style={SMALL_BOX}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          {plainTooltip}
          <Funnel data={rows} dataKey="value" nameKey="name" lastShapeType="rectangle" isAnimationActive={false}>
            {rows.map((row, index) => (
              <Cell key={row.name} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
            ))}
            <LabelList position="right" dataKey="name" fill="var(--gn-fg-3)" stroke="none" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

export const commonChartSection: GallerySectionDef = {
  id: 'common-chart',
  group: 'common',
  titleKey: 'gallery.section.common-chart.title',
  descKey: 'gallery.section.common-chart.desc',
  items: [
    {
      id: 'common-chart-cartesian', name: 'LineChart / AreaChart / BarChart',
      source: 'recharts 3', wide: true, render: () => <CartesianGallery />,
    },
    {
      id: 'common-chart-composed', name: 'ComposedChart',
      source: 'recharts 3', wide: true, render: () => <ComposedSample />,
    },
    {
      id: 'common-chart-pie', name: 'PieChart',
      source: 'recharts 3', render: () => <PieSample />,
    },
    {
      id: 'common-chart-radar', name: 'RadarChart',
      source: 'recharts 3', render: () => <RadarSample />,
    },
    {
      id: 'common-chart-scatter', name: 'ScatterChart',
      source: 'recharts 3', render: () => <ScatterSample />,
    },
    {
      id: 'common-chart-radial', name: 'RadialBarChart',
      source: 'recharts 3', render: () => <RadialSample />,
    },
    {
      id: 'common-chart-treemap', name: 'Treemap',
      source: 'recharts 3', render: () => <TreemapSample />,
    },
    {
      id: 'common-chart-funnel', name: 'FunnelChart',
      source: 'recharts 3', render: () => <FunnelSample />,
    },
  ],
};
