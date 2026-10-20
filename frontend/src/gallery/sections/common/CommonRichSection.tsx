import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import vs from 'react-syntax-highlighter/dist/esm/styles/prism/vs';
import DOMPurify from 'dompurify';
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { format } from 'sql-formatter';
import { v4 as uuidv4 } from 'uuid';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

import {
  assertSafeMermaidSource,
  buildMermaidConfig,
  buildMermaidSandboxDocument,
  enqueueMermaidRender,
  sanitizeMermaidSvg,
  withMermaidRenderTimeout,
} from '../../../components/ai/messageBubble/mermaidSecurity';
import { useI18n } from '../../../i18n/provider';
import { useSampleText } from '../../sampleText';
import type { GallerySectionDef } from '../../galleryRegistry';

// prism-light 只带核心，按需注册语言，注册方式与 AIMessageCodeBlock 一致。
[javascript, typescript, sql, json].forEach((language) => {
  SyntaxHighlighter.registerLanguage('', language);
});

// 演示用的脏 HTML：带 script 标签与 onerror 事件属性，用来对照净化前后。
const UNSAFE_HTML = '<div class="card"><img src="avatar.png" onerror="alert(1)">'
  + '<script>alert("xss")</script><strong>GoNavi</strong></div>';

// 代码块统一样式：颜色全部来自画廊主题变量，切换主题自动跟随。
const CODE_PANEL_STYLE: React.CSSProperties = {
  margin: 0, padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gn-br-2)',
  background: 'var(--gn-bg-input)', color: 'var(--gn-fg-1)', fontFamily: 'var(--gn-font-mono)',
  fontSize: 12, lineHeight: 1.6, overflow: 'auto',
};

const PRE_STYLE: React.CSSProperties = {
  ...CODE_PANEL_STYLE, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block', marginBottom: 6, fontSize: 11, color: 'var(--gn-fg-4)', fontFamily: 'var(--gn-font-mono)',
};

const MD_PANEL_STYLE: React.CSSProperties = {
  position: 'relative', width: '100%', maxWidth: 760, padding: 16, border: '1px solid var(--gn-br-2)',
  borderRadius: 8, background: 'var(--gn-bg-panel-2)', color: 'var(--gn-fg-2)', fontSize: 13, lineHeight: 1.6,
};

const MD_CODE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--gn-font-mono)', fontSize: 12, color: 'var(--gn-fg-1)',
  background: 'var(--gn-bg-input)', padding: '1px 4px', borderRadius: 4,
};

const MD_PRE_STYLE: React.CSSProperties = {
  margin: '8px 0', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gn-br-2)',
  background: 'var(--gn-bg-input)', color: 'var(--gn-fg-1)', fontFamily: 'var(--gn-font-mono)', fontSize: 12, overflow: 'auto',
};

const MD_TABLE_STYLE: React.CSSProperties = { borderCollapse: 'collapse', color: 'var(--gn-fg-2)', margin: '8px 0' };
const MD_TH_STYLE: React.CSSProperties = { padding: '4px 10px', border: '1px solid var(--gn-br-2)', background: 'var(--gn-bg-panel-2)', color: 'var(--gn-fg-1)', textAlign: 'left' };
const MD_TD_STYLE: React.CSSProperties = { padding: '4px 10px', border: '1px solid var(--gn-br-2)', color: 'var(--gn-fg-2)' };
const MD_H3_STYLE: React.CSSProperties = { margin: '12px 0 6px', color: 'var(--gn-fg-1)', fontSize: 14 };

const MERMAID_FRAME_STYLE: React.CSSProperties = {
  width: 460, maxWidth: '100%', height: 220, border: '1px solid var(--gn-br-2)', borderRadius: 8,
  background: 'var(--gn-bg-panel)',
};

const MERMAID_WAIT_STYLE: React.CSSProperties = {
  width: 460, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px dashed var(--gn-br-3)', borderRadius: 8, color: 'var(--gn-fg-4)', fontSize: 12,
};

const MERMAID_ERROR_STYLE: React.CSSProperties = {
  width: 460, padding: 12, borderRadius: 6, border: '1px solid var(--gn-br-2)',
  background: 'var(--gn-bg-panel-2)', color: 'var(--gn-fg-2)', fontSize: 12,
};

// 产品的 sanitizeMermaidSvg 会剥掉 SVG 内的 <style> 与 style 属性（安全要求），
// mermaid 的节点填充、描边和文字色都写在那段样式里，剥掉后图会变成一块块黑。
// 这里不改产品的消毒口径，只在沙箱文档里按画廊主题补回等效规则。
const MERMAID_THEME_CSS = [
  '.node rect, .node polygon, .node circle, .nodePath { fill: __panel__; stroke: __border__; stroke-width: 1.5px; }',
  '.node .label-container { fill: __panel__; }',
  '.nodeLabel, .nodeLabel p, .edgeLabel, .edgeLabel p, .label, text { fill: __fg__ !important; color: __fg__ !important; }',
  '.edgePath path, .flowchart-link, path.flowchart-link, .edge-thickness-solid { stroke: __border__; fill: none; }',
  '.marker, .arrowMarkerPath, marker path { fill: __border__; stroke: __border__; }',
  '.cluster rect, .cluster polygon { fill: __panel2__; stroke: __border__; }',
].join('');

const readThemeColor = (name: string, fallback: string): string => {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.body).getPropertyValue(name).trim();
  return value || fallback;
};

const buildThemedMermaidDocument = (svg: string): string => {
  const css = MERMAID_THEME_CSS
    .replace(/__panel__/g, readThemeColor('--gn-bg-panel-2', '#f5f5f4'))
    .replace(/__panel2__/g, readThemeColor('--gn-bg-panel', '#ffffff'))
    .replace(/__border__/g, readThemeColor('--gn-br-3', '#8c8c8c'))
    .replace(/__fg__/g, readThemeColor('--gn-fg-1', '#1f1f1f'));
  return buildMermaidSandboxDocument(svg, false).replace('</head>', `<style>${css}</style></head>`);
};

// 带标签的竖排容器，条目里统一用它承载代码块。
const Panel: React.FC<{ label?: string; width?: number; children: React.ReactNode }> = ({ label, width = 380, children }) => (
  <div style={{ width, maxWidth: '100%' }}>
    {label ? <span style={LABEL_STYLE}>{label}</span> : null}
    {children}
  </div>
);

// react-markdown 的自定义渲染：代码、表格、链接、标题都继承画廊主题变量。
const MARKDOWN_COMPONENTS: Components = {
  code: ({ node: _node, className, children, ...rest }) => (
    <code {...rest} className={className} style={MD_CODE_STYLE}>{children}</code>
  ),
  pre: ({ node: _node, children, ...rest }) => (
    <pre {...rest} style={MD_PRE_STYLE}>{children}</pre>
  ),
  table: ({ node: _node, children, ...rest }) => (
    <table {...rest} style={MD_TABLE_STYLE}>{children}</table>
  ),
  th: ({ node: _node, children, ...rest }) => (
    <th {...rest} style={MD_TH_STYLE}>{children}</th>
  ),
  td: ({ node: _node, children, ...rest }) => (
    <td {...rest} style={MD_TD_STYLE}>{children}</td>
  ),
  a: ({ node: _node, children, ...rest }) => (
    <a {...rest} style={{ color: 'var(--gn-accent)', textDecoration: 'underline' }}>{children}</a>
  ),
  h3: ({ node: _node, children, ...rest }) => (
    <h3 {...rest} style={MD_H3_STYLE}>{children}</h3>
  ),
};

const MarkdownRow: React.FC = () => {
  const s = useSampleText();
  return (
    <div style={MD_PANEL_STYLE}>
      <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
        {s.richMarkdown}
      </Markdown>
    </div>
  );
};

const SyntaxRow: React.FC = () => {
  const s = useSampleText();
  return (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <SyntaxHighlighter
        language="typescript"
        style={vs}
        PreTag="div"
        showLineNumbers
        customStyle={CODE_PANEL_STYLE}
        codeTagProps={{ style: { fontFamily: 'var(--gn-font-mono)', fontSize: 12, color: 'var(--gn-fg-1)' } }}
      >
        {s.richCode}
      </SyntaxHighlighter>
    </div>
  );
};

const MermaidRow: React.FC = () => {
  const { t } = useI18n();
  const s = useSampleText();
  const [sandboxDocument, setSandboxDocument] = useState('');
  const [renderError, setRenderError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setSandboxDocument('');
    setRenderError('');
    const source = s.richMermaid;

    (async () => {
      try {
        assertSafeMermaidSource(source);
        const { default: mermaid } = await import('mermaid');
        if (cancelled) return;
        const doc = await enqueueMermaidRender(async () => {
          mermaid.initialize(buildMermaidConfig(false));
          const id = `gallery-mermaid-${Math.random().toString(36).slice(2)}`;
          const rendered = await withMermaidRenderTimeout(mermaid.render(id, source));
          return buildThemedMermaidDocument(sanitizeMermaidSvg(String(rendered?.svg || '')));
        });
        if (!cancelled) setSandboxDocument(doc);
      } catch (error) {
        if (!cancelled) setRenderError(error instanceof Error ? error.message : String(error));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [s.richMermaid]);

  if (renderError) {
    return <div style={MERMAID_ERROR_STYLE}>{s.error}: {renderError}</div>;
  }

  if (!sandboxDocument) {
    return <div aria-busy="true" style={MERMAID_WAIT_STYLE}>{t('common.loading')}</div>;
  }

  return (
    <iframe
      title="Mermaid"
      sandbox=""
      srcDoc={sandboxDocument}
      style={MERMAID_FRAME_STYLE}
    />
  );
};

const SanitizeRow: React.FC = () => {
  const s = useSampleText();
  const sanitized = useMemo(() => DOMPurify.sanitize(UNSAFE_HTML), []);
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Panel label="DOMPurify.sanitize(input)" width={300}>
        <pre style={PRE_STYLE}>{UNSAFE_HTML}</pre>
      </Panel>
      <Panel label={s.richSanitized} width={300}>
        <pre style={PRE_STYLE}>{sanitized}</pre>
      </Panel>
    </div>
  );
};

const SqlFormatterRow: React.FC = () => {
  const s = useSampleText();
  const formatted = useMemo(() => {
    try {
      return format(s.richSql, { language: 'sql' });
    } catch {
      return s.richSql;
    }
  }, [s.richSql]);
  return (
    <Panel width={460}>
      <pre style={PRE_STYLE}>{formatted}</pre>
    </Panel>
  );
};

const ArchiveRow: React.FC = () => {
  const s = useSampleText();
  const archive = useMemo(() => {
    const raw = strToU8(s.richZip);
    const zipped = zipSync({ 'note.txt': raw });
    const unzipped = unzipSync(zipped);
    const entry = unzipped['note.txt'];
    return { rawBytes: raw.length, zipBytes: zipped.length, text: entry ? strFromU8(entry) : '' };
  }, [s.richZip]);
  return (
    <Panel label={s.richZip} width={380}>
      <pre style={PRE_STYLE}>{archive.text}</pre>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--gn-fg-4)', fontFamily: 'var(--gn-font-mono)' }}>
        <div>strToU8: {archive.rawBytes} B</div>
        <div>zipSync: {archive.zipBytes} B</div>
      </div>
    </Panel>
  );
};

const UuidRow: React.FC = () => {
  const { t } = useI18n();
  const [id, setId] = useState(() => uuidv4());
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <code style={{ ...PRE_STYLE, display: 'inline-block' }}>{id}</code>
      <Button size="small" icon={<ReloadOutlined />} onClick={() => setId(uuidv4())}>
        {t('common.refresh')}
      </Button>
    </div>
  );
};

const ResizableRow: React.FC = () => {
  const s = useSampleText();
  const [size, setSize] = useState({ width: 300, height: 170 });
  return (
    <div
      style={{
        position: 'relative', width: 420, height: 260, border: '1px solid var(--gn-br-2)',
        borderRadius: 8, background: 'var(--gn-bg-panel-2)',
      }}
    >
      <Resizable
        width={size.width}
        height={size.height}
        minConstraints={[200, 120]}
        maxConstraints={[400, 240]}
        onResize={(_event, data) => setSize({ width: data.size.width, height: data.size.height })}
      >
        <div
          style={{
            width: size.width, height: size.height, boxSizing: 'border-box', padding: 12,
            border: '1px solid var(--gn-br-3)', borderRadius: 6, background: 'var(--gn-bg-panel)',
            color: 'var(--gn-fg-2)', fontSize: 12, overflow: 'auto',
          }}
        >
          <div style={{ marginBottom: 6 }}>{s.panelBody}</div>
          <div style={{ fontFamily: 'var(--gn-font-mono)', color: 'var(--gn-fg-4)' }}>
            {size.width} × {size.height}
          </div>
        </div>
      </Resizable>
    </div>
  );
};

export const commonRichSection: GallerySectionDef = {
  id: 'common-rich',
  group: 'common',
  titleKey: 'gallery.section.common-rich.title',
  descKey: 'gallery.section.common-rich.desc',
  items: [
    {
      id: 'common-rich-markdown',
      name: 'react-markdown + remark-gfm',
      source: 'react-markdown 10 + remark-gfm 4',
      wide: true,
      render: () => <MarkdownRow />,
    },
    {
      id: 'common-rich-syntax',
      name: 'react-syntax-highlighter',
      source: 'react-syntax-highlighter 16',
      render: () => <SyntaxRow />,
    },
    {
      id: 'common-rich-mermaid',
      name: 'mermaid',
      source: 'mermaid 11',
      render: () => <MermaidRow />,
    },
    {
      id: 'common-rich-sanitize',
      name: 'DOMPurify',
      source: 'dompurify 3',
      render: () => <SanitizeRow />,
    },
    {
      id: 'common-rich-sql-formatter',
      name: 'sql-formatter',
      source: 'sql-formatter 15',
      render: () => <SqlFormatterRow />,
    },
    {
      id: 'common-rich-archive',
      name: 'fflate',
      source: 'fflate 0.8',
      render: () => <ArchiveRow />,
    },
    {
      id: 'common-rich-id',
      name: 'uuid',
      source: 'uuid 9',
      render: () => <UuidRow />,
    },
    {
      id: 'common-rich-resizable',
      name: 'react-resizable',
      source: 'react-resizable 3',
      render: () => <ResizableRow />,
    },
  ],
};
