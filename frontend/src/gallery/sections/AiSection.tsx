import React from 'react';
import { Space } from 'antd';
import { AIContextRing } from '../../components/ai/AIContextRing';
import { buildAIContextBreakdown } from '../../components/ai/aiContextBreakdown';
import { AIProviderLogo } from '../../components/ai/AIProviderLogo';
import { AIChatWelcome } from '../../components/ai/AIChatWelcome';
import { AIChatComposerNotice } from '../../components/ai/AIChatComposerNotice';
import { AIThinkingBlock } from '../../components/ai/messageBubble/AIThinkingBlock';
import { AIToolCallingBlock } from '../../components/ai/messageBubble/AIToolCallingBlock';
import { buildOverlayWorkbenchTheme } from '../../utils/overlayWorkbenchTheme';
import type { AIToolCall } from '../../types';
import { useI18n } from '../../i18n/provider';
import { useSampleText } from '../sampleText';
import type { GallerySectionDef } from '../galleryRegistry';
// provider logo 的基础尺寸由这个 CSS 给出，画廊不自己另写一套。
import '../../components/ai/AISettingsProvidersSection.css';

const DEMO_TOOL_CALLS: AIToolCall[] = [
  {
    id: 'call-1',
    type: 'function',
    function: { name: 'query_schema', arguments: '{"table":"events"}' },
  },
  {
    id: 'call-2',
    type: 'function',
    function: { name: 'run_query', arguments: '{"sql":"SELECT 1"}' },
  },
];

const ContextRingRow: React.FC = () => {
  const { t } = useI18n();
  const s = useSampleText();
  const breakdown = buildAIContextBreakdown({
    windowSize: 128_000,
    reservedOutput: 8_000,
    workspaceBytes: 18_000,
    boundBytes: 6_400,
    history: { user: 4_200, assistant: 9_600, toolResults: 3_100, messageCount: 12 },
    draftText: s.draftSample,
  });
  const usedPercent = Math.round((breakdown.used / breakdown.budget) * 100);
  return (
    <div className="gonavi-component-gallery-row">
      <AIContextRing breakdown={breakdown} copy={(key, params) => t(key, params)} />
      <span className="gonavi-component-gallery-label">
        {t('gallery.sample.primary')} {usedPercent}%
      </span>
    </div>
  );
};

const ProviderLogoRow: React.FC = () => (
  <div className="gonavi-component-gallery-row">
    {['openai', 'anthropic', 'deepseek', 'qwen', 'ollama'].map((presetKey) => (
      <AIProviderLogo key={presetKey} presetKey={presetKey} label={presetKey} />
    ))}
  </div>
);

const WelcomeRow: React.FC = () => {
  const overlayTheme = buildOverlayWorkbenchTheme(false);
  return (
    <div style={{ width: 300, border: '1px solid var(--gn-br-2)', borderRadius: 8, overflow: 'hidden' }}>
      <AIChatWelcome
        overlayTheme={overlayTheme}
        quickActionBg={overlayTheme.sectionBg}
        quickActionBorder={overlayTheme.sectionBorder}
        textColor={overlayTheme.titleText}
        mutedColor={overlayTheme.mutedText}
        onQuickAction={() => undefined}
        contextTableNames={['events', 'sessions']}
      />
    </div>
  );
};

const ThinkingRow: React.FC = () => {
  const overlayTheme = buildOverlayWorkbenchTheme(false);
  const s = useSampleText();
  return (
    <div style={{ width: 420 }}>
      <AIThinkingBlock
        displayThinking={s.thinkingSample}
        isTyping={false}
        isGlobalLoading={false}
        darkMode={false}
        overlayTheme={overlayTheme}
        hasContent
      />
    </div>
  );
};

const ToolCallRow: React.FC = () => {
  const overlayTheme = buildOverlayWorkbenchTheme(false);
  return (
    <div style={{ width: 420 }}>
      <AIToolCallingBlock
        toolCalls={DEMO_TOOL_CALLS}
        loading={false}
        toolResultsById={new Map()}
        darkMode={false}
        overlayTheme={overlayTheme}
        hasContent
      />
    </div>
  );
};

const NoticeRow: React.FC = () => {
  const { t } = useI18n();
  return (
    <Space size={12} wrap style={{ width: 460 }}>
      <AIChatComposerNotice
        composerNotice={{
          tone: 'warning',
          title: t('gallery.sample.run'),
          description: t('gallery.section.ai.desc'),
        }}
        darkMode={false}
        textColor="var(--gn-fg-1)"
        mutedColor="var(--gn-fg-4)"
      />
    </Space>
  );
};

export const aiSection: GallerySectionDef = {
  id: 'ai',
  group: 'project',
  titleKey: 'gallery.section.ai.title',
  descKey: 'gallery.section.ai.desc',
  items: [
    {
      id: 'ai-context-ring',
      name: 'AIContextRing',
      source: 'components/ai/AIContextRing.tsx',
      render: () => <ContextRingRow />,
    },
    {
      id: 'ai-provider-logo',
      name: 'AIProviderLogo',
      source: 'components/ai/AIProviderLogo.tsx',
      render: () => <ProviderLogoRow />,
    },
    {
      id: 'ai-chat-welcome',
      name: 'AIChatWelcome',
      source: 'components/ai/AIChatWelcome.tsx',
      render: () => <WelcomeRow />,
    },
    {
      id: 'ai-thinking-block',
      name: 'AIThinkingBlock',
      source: 'components/ai/messageBubble/AIThinkingBlock.tsx',
      render: () => <ThinkingRow />,
    },
    {
      id: 'ai-tool-calling-block',
      name: 'AIToolCallingBlock',
      source: 'components/ai/messageBubble/AIToolCallingBlock.tsx',
      render: () => <ToolCallRow />,
    },
    {
      id: 'ai-composer-notice',
      name: 'AIChatComposerNotice',
      source: 'components/ai/AIChatComposerNotice.tsx',
      render: () => <NoticeRow />,
    },
  ],
};
