import React, { useMemo } from 'react';
import { Input, Segmented, Select, Space, Tooltip } from 'antd';
import { useI18n } from '../../i18n/provider';
import type { GalleryThemeApi } from '../theme/useGalleryTheme';
import type { BuiltinCustomThemePreset } from '../../utils/customThemePresets';

type GalleryToolbarProps = {
  theme: GalleryThemeApi;
  uiLayoutMode: 'classic' | 'navicat';
  onUiLayoutModeChange: (mode: 'classic' | 'navicat') => void;
  search: string;
  onSearchChange: (value: string) => void;
};

const BASE_OPTION_VALUE = 'base:light';

const ThemeSwatch = ({ preset }: { preset: BuiltinCustomThemePreset }) => (
  <span
    className="gonavi-component-gallery-theme-swatch"
    style={{
      background: preset.preview.app,
      borderColor: preset.preview.accent,
    }}
    aria-hidden="true"
  >
    <i style={{ background: preset.preview.accent }} />
  </span>
);

const BaseSwatch = ({ mode }: { mode: 'light' | 'dark' }) => (
  <span
    className="gonavi-component-gallery-theme-swatch"
    style={{
      background: mode === 'dark' ? '#161a1d' : '#f4f4f2',
      borderColor: mode === 'dark' ? '#22c55e' : '#15803d',
    }}
    aria-hidden="true"
  >
    <i style={{ background: mode === 'dark' ? '#22c55e' : '#15803d' }} />
  </span>
);

// 顶部工具条：主题切换、明暗基线、布局模式、搜索。
// 主题选项按预设自身声明的 baseMode 分组，浅色预设归到浅色组、暗色预设归到暗色组，
// 与主应用的自定义主题管理器保持同一套分组口径。
const GalleryToolbar = ({
  theme,
  uiLayoutMode,
  onUiLayoutModeChange,
  search,
  onSearchChange,
}: GalleryToolbarProps) => {
  const { t } = useI18n();

  const themeOptions = useMemo(() => {
    const lightPresets = theme.presets.filter((preset) => preset.baseMode === 'light');
    const darkPresets = theme.presets.filter((preset) => preset.baseMode === 'dark');
    return [
      {
        label: t('gallery.theme.group.base'),
        options: [
          {
            value: 'base:light',
            label: (
              <span className="gonavi-component-gallery-theme-option">
                <BaseSwatch mode="light" />
                {t('gallery.theme.base.light')}
              </span>
            ),
          },
          {
            value: 'base:dark',
            label: (
              <span className="gonavi-component-gallery-theme-option">
                <BaseSwatch mode="dark" />
                {t('gallery.theme.base.dark')}
              </span>
            ),
          },
        ],
      },
      {
        label: t('gallery.theme.group.light'),
        options: lightPresets.map((preset) => ({
          value: `preset:${preset.id}`,
          label: (
            <span className="gonavi-component-gallery-theme-option">
              <ThemeSwatch preset={preset} />
              {t(preset.nameKey)}
            </span>
          ),
        })),
      },
      {
        label: t('gallery.theme.group.dark'),
        options: darkPresets.map((preset) => ({
          value: `preset:${preset.id}`,
          label: (
            <span className="gonavi-component-gallery-theme-option">
              <ThemeSwatch preset={preset} />
              {t(preset.nameKey)}
            </span>
          ),
        })),
      },
    ];
  }, [t, theme.presets]);

  const selectedThemeValue = theme.selection.kind === 'base'
    ? `base:${theme.selection.mode}`
    : `preset:${theme.selection.presetId}`;

  return (
    <header className="gonavi-component-gallery-toolbar">
      <div className="gonavi-component-gallery-toolbar-brand">
        <strong>{t('gallery.title')}</strong>
        <span>{t('gallery.subtitle')}</span>
      </div>
      <Space size={12} wrap className="gonavi-component-gallery-toolbar-actions">
        <Tooltip title={t('gallery.theme.hint')}>
          <Select
            className="gonavi-component-gallery-theme-select"
            value={selectedThemeValue}
            options={themeOptions}
            onChange={(value) => {
              if (value === BASE_OPTION_VALUE) {
                theme.selectBase('light');
                return;
              }
              if (value === 'base:dark') {
                theme.selectBase('dark');
                return;
              }
              theme.selectPreset(value.replace(/^preset:/, ''));
            }}
            popupMatchSelectWidth={280}
            showSearch
            optionFilterProp="label"
          />
        </Tooltip>
        <Segmented
          value={uiLayoutMode}
          onChange={(value) => onUiLayoutModeChange(value as 'classic' | 'navicat')}
          options={[
            { value: 'classic', label: t('gallery.theme.layout.classic') },
            { value: 'navicat', label: t('gallery.theme.layout.navicat') },
          ]}
        />
        <Input.Search
          className="gonavi-component-gallery-search"
          allowClear
          placeholder={t('gallery.search.placeholder')}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </Space>
    </header>
  );
};

export default React.memo(GalleryToolbar);
