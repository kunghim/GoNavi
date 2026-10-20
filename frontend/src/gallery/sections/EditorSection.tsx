import React from 'react';
import MonacoEditor from '../../components/MonacoEditor';
import { AIMessageMarkdown } from '../../components/ai/messageBubble/AIMessageMarkdown';
import { buildOverlayWorkbenchTheme } from '../../utils/overlayWorkbenchTheme';
import { useI18n } from '../../i18n/provider';
import { useSampleText } from '../sampleText';
import type { GallerySectionDef } from '../galleryRegistry';

const SAMPLE_SQL = `SELECT region, COUNT(*) AS orders, SUM(revenue) AS total
FROM events
WHERE created_at >= DATE '2026-03-01'
GROUP BY region
ORDER BY total DESC;`;

const MonacoRow: React.FC = () => (
  <div style={{ width: 520, height: 220 }}>
    <MonacoEditor
      language="sql"
      value={SAMPLE_SQL}
      height="220px"
      theme="transparent-light"
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
    />
  </div>
);

const MonacoDarkRow: React.FC = () => (
  <div style={{ width: 520, height: 220 }}>
    <MonacoEditor
      language="sql"
      value={SAMPLE_SQL}
      height="220px"
      theme="transparent-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
    />
  </div>
);

const MarkdownRow: React.FC = () => {
  const overlayTheme = buildOverlayWorkbenchTheme(false);
  const s = useSampleText();
  return (
    <div style={{ width: 420 }}>
      <AIMessageMarkdown
        content={s.markdownSample}
        darkMode={false}
        overlayTheme={overlayTheme}
      />
    </div>
  );
};

export const editorSection: GallerySectionDef = {
  id: 'editor',
  group: 'project',
  titleKey: 'gallery.section.editor.title',
  descKey: 'gallery.section.editor.desc',
  items: [
    {
      id: 'editor-monaco',
      name: 'MonacoEditor',
      source: 'components/MonacoEditor.tsx',
      render: () => <MonacoRow />,
    },
    {
      id: 'editor-markdown',
      name: 'AIMessageMarkdown',
      source: 'components/ai/messageBubble/AIMessageMarkdown.tsx',
      render: () => <MarkdownRow />,
    },
    {
      id: 'editor-monaco-dark',
      name: 'MonacoEditor · Dark',
      source: 'components/MonacoEditor.tsx',
      render: () => <MonacoDarkRow />,
    },
  ],
};
