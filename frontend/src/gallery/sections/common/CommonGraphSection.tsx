import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background, BackgroundVariant, Controls, Handle, MiniMap, Position, ReactFlowProvider,
  useEdgesState, useNodesState, type Edge, type Node, type NodeProps, type NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  DndContext, DragOverlay, PointerSensor, closestCenter, useDroppable, useSensor, useSensors,
  type DragEndEvent, type DragOverEvent, type Over,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dagre from 'dagre';
import type { GallerySectionDef } from '../../galleryRegistry';
import { useSampleText } from '../../sampleText';

type GalleryFlowData = { label: string; table: string; accent: boolean };

// reactflow 自带的控件是浅色硬编码，这里用作用域样式把它拉回画廊主题变量。
const FLOW_THEME_CSS = `
.gonavi-component-gallery-flow .react-flow__controls { overflow: hidden; border: 1px solid var(--gn-br-2); border-radius: 8px; }
.gonavi-component-gallery-flow .react-flow__controls-button { color: var(--gn-fg-2); background: var(--gn-bg-panel); border-bottom-color: var(--gn-br-2); }
.gonavi-component-gallery-flow .react-flow__controls-button:hover { background: var(--gn-bg-hover); }
.gonavi-component-gallery-flow .react-flow__controls-button svg { fill: currentColor; }
.gonavi-component-gallery-flow .react-flow__minimap { border: 1px solid var(--gn-br-2); border-radius: 8px; }
`;

const GALLERY_NODE_TYPES: NodeTypes = {
  gallery: ({ data }: NodeProps<GalleryFlowData>) => (
    <div
      style={{
        minWidth: 132, padding: '8px 12px', borderRadius: 8, fontSize: 12, lineHeight: 1.5, textAlign: 'center',
        border: `1px solid ${data.accent ? 'var(--gn-accent)' : 'var(--gn-br-2)'}`,
        background: 'var(--gn-bg-panel-2)', color: 'var(--gn-fg-1)',
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <div style={{ fontWeight: 600 }}>{data.label}</div>
      <code style={{ fontSize: 11, color: 'var(--gn-fg-4)' }}>{data.table}</code>
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </div>
  ),
};

const FLOW_POSITIONS: Record<string, { x: number; y: number }> = {
  n1: { x: 170, y: 240 },
  n2: { x: 0, y: 120 },
  n3: { x: 340, y: 120 },
  n4: { x: 170, y: 0 },
};

const FLOW_EDGES: { from: string; to: string }[] = [
  { from: 'n1', to: 'n2' },
  { from: 'n1', to: 'n3' },
  { from: 'n2', to: 'n4' },
  { from: 'n3', to: 'n4' },
];

const FlowCanvas: React.FC = () => {
  const s = useSampleText();
  const initialNodes = useMemo<Node<GalleryFlowData>[]>(
    () => [
      { id: 'n1', type: 'gallery', position: FLOW_POSITIONS.n1, data: { label: s.graphScan, table: 'events', accent: false } },
      { id: 'n2', type: 'gallery', position: FLOW_POSITIONS.n2, data: { label: s.graphFilter, table: 'events', accent: false } },
      { id: 'n3', type: 'gallery', position: FLOW_POSITIONS.n3, data: { label: s.graphAggregate, table: 'orders', accent: true } },
      { id: 'n4', type: 'gallery', position: FLOW_POSITIONS.n4, data: { label: s.graphSort, table: 'orders', accent: true } },
    ],
    [s],
  );
  const initialEdges = useMemo<Edge[]>(
    () => FLOW_EDGES.map((edge, index) => ({
      id: `e${index}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      style: { stroke: 'var(--gn-br-3)', strokeWidth: 1.5 },
    })),
    [],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // useNodesState 只认初始值，语言切换后要把新文案灌回节点。
  useEffect(() => { setNodes(initialNodes); }, [initialNodes, setNodes]);
  useEffect(() => { setEdges(initialEdges); }, [initialEdges, setEdges]);
  return (
    <div className="gonavi-component-gallery-flow" style={{ width: '100%', height: 320 }}>
      <style>{FLOW_THEME_CSS}</style>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={GALLERY_NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor={() => 'currentColor'}
            nodeStrokeColor={() => 'currentColor'}
            maskColor="transparent"
            style={{ color: 'var(--gn-accent)', background: 'var(--gn-bg-panel-2)' }}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

type DagreSpec = { id: string; label: string; table: string };
type DagrePoint = DagreSpec & { x: number; y: number };

const DAGRE_EDGES: { from: string; to: string }[] = FLOW_EDGES;
const DAGRE_NODE_W = 116;
const DAGRE_NODE_H = 62;
const DAGRE_BOX_W = 420;
const DAGRE_BOX_H = 260;

// dagre 只负责算坐标，渲染由绝对定位的 HTML 节点和 SVG 连线完成。
const buildDagrePoints = (specs: DagreSpec[]): DagrePoint[] => {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: 'TB', nodesep: 24, ranksep: 16, marginx: 16, marginy: 12 });
  graph.setDefaultEdgeLabel(() => ({}));
  for (const spec of specs) graph.setNode(spec.id, { width: DAGRE_NODE_W, height: DAGRE_NODE_H });
  for (const edge of DAGRE_EDGES) graph.setEdge(edge.from, edge.to);
  dagre.layout(graph);
  return specs.map((spec) => {
    const point = graph.node(spec.id);
    return { ...spec, x: point.x, y: point.y };
  });
};

const DagreCanvas: React.FC = () => {
  const s = useSampleText();
  const points = useMemo(
    () => buildDagrePoints([
      { id: 'n1', label: s.graphScan, table: 'events' },
      { id: 'n2', label: s.graphFilter, table: 'events' },
      { id: 'n3', label: s.graphAggregate, table: 'orders' },
      { id: 'n4', label: s.graphSort, table: 'orders' },
    ]),
    [s],
  );
  const byId = useMemo(() => new Map(points.map((point) => [point.id, point])), [points]);
  return (
    <div style={{ position: 'relative', width: DAGRE_BOX_W, height: DAGRE_BOX_H, border: '1px solid var(--gn-br-2)', borderRadius: 8, background: 'var(--gn-bg-panel-2)' }}>
      <svg width={DAGRE_BOX_W} height={DAGRE_BOX_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {DAGRE_EDGES.map((edge) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;
          return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{ stroke: 'var(--gn-br-3)', strokeWidth: 1.5 }} />;
        })}
      </svg>
      {points.map((point) => (
        <div
          key={point.id}
          style={{
            position: 'absolute', boxSizing: 'border-box', padding: '5px 8px', fontSize: 12, lineHeight: 1.35, textAlign: 'center',
            left: point.x - DAGRE_NODE_W / 2, top: point.y - DAGRE_NODE_H / 2, width: DAGRE_NODE_W, height: DAGRE_NODE_H,
            border: '1px solid var(--gn-br-2)', borderRadius: 6,
            background: 'var(--gn-bg-panel)', color: 'var(--gn-fg-1)',
          }}
        >
          <div style={{ fontWeight: 600 }}>{point.label}</div>
          <div style={{ fontSize: 11, color: 'var(--gn-fg-4)' }}>
            <span>{s.table}</span> <code>{point.table}</code>
          </div>
          <code style={{ fontSize: 10, color: 'var(--gn-fg-4)' }}>{`x:${Math.round(point.x)} y:${Math.round(point.y)}`}</code>
        </div>
      ))}
    </div>
  );
};

type ContainerId = 'left' | 'right';

const SORTABLE_COLUMNS = ['id', 'region', 'orders', 'revenue', 'created_at'];
const MULTI_INITIAL: Record<ContainerId, string[]> = {
  left: ['id', 'region', 'orders'],
  right: ['revenue', 'created_at'],
};

const ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  border: '1px solid var(--gn-br-2)',
  borderRadius: 6,
  background: 'var(--gn-bg-panel-2)',
  color: 'var(--gn-fg-1)',
  fontSize: 12,
  cursor: 'grab',
};

type SortableRowProps = {
  id: string;
  label?: string;
  hint?: string;
  container?: ContainerId;
};

// 单列表和多容器共用同一个行组件：transform 负责跟手，transition 负责补间。
const SortableRow: React.FC<SortableRowProps> = ({ id, label, hint, container }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: container ? { container } : undefined,
  });
  return (
    <div
      ref={setNodeRef}
      style={{
        ...ROW_STYLE,
        background: isDragging ? 'var(--gn-bg-hover)' : 'var(--gn-bg-panel-2)',
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <code>{id}</code>
      {label ? <span style={{ color: 'var(--gn-fg-4)' }}>{label}</span> : null}
      {hint ? <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gn-fg-4)' }}>{hint}</span> : null}
    </div>
  );
};

const SortableListDemo: React.FC = () => {
  const s = useSampleText();
  const [items, setItems] = useState<string[]>(SORTABLE_COLUMNS);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((current) => {
      const from = current.indexOf(String(active.id));
      const to = current.indexOf(String(over.id));
      return from === -1 || to === -1 ? current : arrayMove(current, from, to);
    });
  }, []);
  return (
    <div style={{ width: 380 }}>
      <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--gn-fg-1)' }}>{s.graphContainer}</div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {items.map((item) => <SortableRow key={item} id={item} label={s.graphColumn} hint={s.graphSortHint} />)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

// 悬停目标带 container 标记：行本身带，容器投放区也带。
const containerOf = (over: Over): ContainerId | null => {
  const raw = over.data.current?.container as ContainerId | undefined;
  return raw === 'left' || raw === 'right' ? raw : null;
};

const MultiBox: React.FC<{ id: ContainerId; title: string; items: string[] }> = ({ id, title, items }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `${id}-box`, data: { container: id } });
  return (
    <div
      ref={setNodeRef}
      style={{
        flex: '1 1 0',
        minWidth: 180,
        padding: 8,
        border: `1px solid ${isOver ? 'var(--gn-accent)' : 'var(--gn-br-2)'}`,
        borderRadius: 8,
        background: 'var(--gn-bg-panel-2)',
      }}
    >
      <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--gn-fg-1)' }}>{title}</div>
      <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 96 }}>
          {items.map((item) => <SortableRow key={item} id={item} container={id} />)}
        </div>
      </SortableContext>
    </div>
  );
};

const MultiContainerDemo: React.FC = () => {
  const s = useSampleText();
  const [containers, setContainers] = useState<Record<ContainerId, string[]>>(MULTI_INITIAL);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  // 跨容器：悬停到另一个容器时就把条目插到目标位置。
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeKey = String(active.id);
    const target = containerOf(over);
    if (!target) return;
    setContainers((current) => {
      const source = current.left.includes(activeKey) ? 'left' : current.right.includes(activeKey) ? 'right' : null;
      if (!source || source === target) return current;
      const next = [...current[target]];
      const overIndex = next.indexOf(String(over.id));
      next.splice(overIndex === -1 ? next.length : overIndex, 0, activeKey);
      return { ...current, [source]: current[source].filter((item) => item !== activeKey), [target]: next };
    });
  }, []);

  // 同容器：落点排序。
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const target = containerOf(over);
    if (!target) return;
    const activeKey = String(active.id);
    setContainers((current) => {
      const list = current[target];
      const from = list.indexOf(activeKey);
      const to = list.indexOf(String(over.id));
      if (from === -1 || to === -1 || from === to) return current;
      return { ...current, [target]: arrayMove(list, from, to) };
    });
  }, []);

  return (
    <div style={{ width: 460 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(String(event.active.id))}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <MultiBox id="left" title={s.option} items={containers.left} />
          <MultiBox id="right" title={s.subOption} items={containers.right} />
        </div>
        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <div style={{ ...ROW_STYLE, borderColor: 'var(--gn-accent)', boxShadow: 'var(--gn-shadow-md)' }}>
              <code>{activeId}</code>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--gn-fg-4)' }}>{s.graphSortHint}</div>
    </div>
  );
};

export const commonGraphSection: GallerySectionDef = {
  id: 'common-graph',
  group: 'common',
  titleKey: 'gallery.section.common-graph.title',
  descKey: 'gallery.section.common-graph.desc',
  items: [
    {
      id: 'common-graph-reactflow',
      name: 'ReactFlow',
      source: 'reactflow 11',
      wide: true,
      render: () => <FlowCanvas />,
    },
    {
      id: 'common-graph-dagre',
      name: 'dagre Layout',
      source: 'dagre 0.8',
      render: () => <DagreCanvas />,
    },
    {
      id: 'common-graph-dnd-sortable',
      name: 'dnd-kit Sortable List',
      source: '@dnd-kit/core + @dnd-kit/sortable',
      render: () => <SortableListDemo />,
    },
    {
      id: 'common-graph-dnd-multi',
      name: 'dnd-kit Multi Container',
      source: '@dnd-kit/core + @dnd-kit/sortable',
      render: () => <MultiContainerDemo />,
    },
  ],
};
