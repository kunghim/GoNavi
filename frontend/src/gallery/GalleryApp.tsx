import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App, ConfigProvider } from 'antd';
import { getAntdLocale } from '../i18n/frameworkLocale';
import { useI18n } from '../i18n/provider';
import { useStore } from '../store';
import { sanitizeV2SidebarRailScale } from '../store';
import { buildAntdTheme } from '../appShell/antdThemeBuilder';
import { useBodyAppearanceAttributes } from '../hooks/useBodyAppearanceAttributes';
import { sanitizeDataTableFontSize, sanitizeSidebarTreeFontSize } from '../utils/dataGridDisplay';
import CustomThemeStyleHost from '../components/theme/CustomThemeStyleHost';
import { GALLERY_SECTIONS, type GallerySectionDef } from './galleryRegistry';
import { useGalleryTheme } from './theme/useGalleryTheme';
import GalleryToolbar from './shell/GalleryToolbar';
import GalleryNav from './shell/GalleryNav';
import GallerySection from './shell/GallerySection';
import './styles/gallery.css';

const filterSections = (
  sections: readonly GallerySectionDef[],
  keyword: string,
): GallerySectionDef[] => {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return [...sections];
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => (
        item.name.toLowerCase().includes(needle)
        || item.id.toLowerCase().includes(needle)
        || (item.source ?? '').toLowerCase().includes(needle)
      )),
    }))
    .filter((section) => section.items.length > 0);
};

// 组件画廊主界面。
// 主题链路与主应用同源：CSS 变量轨走 CustomThemeStyleHost 注入，
// AntD token 轨走 buildAntdTheme 推导；两轨共用同一份映射，
// 因此切换内置预设时不会出现按钮色与自定义 CSS 割裂。
const GalleryApp = () => {
  const { t, language } = useI18n();
  const theme = useGalleryTheme();
  const [uiLayoutMode, setUiLayoutMode] = useState<'classic' | 'navicat'>('classic');
  const [search, setSearch] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>(GALLERY_SECTIONS[0]?.id ?? '');
  const contentRef = useRef<HTMLDivElement | null>(null);

  const appearance = useStore((state) => state.appearance);
  const fontSize = useStore((state) => state.fontSize);
  const uiScale = useStore((state) => state.uiScale);

  const effectiveFontSize = Math.min(20, Math.max(12, Math.round(Number(fontSize) || 14)));
  const effectiveUiScale = Math.min(1.25, Math.max(0.8, Number(uiScale) || 1));
  const effectiveOpacity = appearance.opacity ?? 1;
  const effectiveDataTableFontSize = appearance.dataTableFontSizeFollowGlobal !== false
    ? effectiveFontSize
    : (sanitizeDataTableFontSize(appearance.dataTableFontSize) ?? effectiveFontSize);
  const effectiveSidebarTreeFontSize = appearance.sidebarTreeFontSizeFollowGlobal !== false
    ? effectiveFontSize
    : (sanitizeSidebarTreeFontSize(appearance.sidebarTreeFontSize) ?? effectiveFontSize);
  const effectiveSidebarRailScale = sanitizeV2SidebarRailScale(appearance.v2SidebarRailScale);

  useBodyAppearanceAttributes({
    darkMode: theme.darkMode,
    documentPlatform: 'browser',
    uiLayoutMode,
    showDataTableCheckboxColumn: appearance.showDataTableCheckboxColumn ?? null,
    fontSize: effectiveFontSize,
    uiFontFamily: 'var(--gn-font-sans, inherit)',
    monoFontFamily: 'var(--gn-font-mono, monospace)',
    uiScale: effectiveUiScale,
    opacity: effectiveOpacity,
    dataTableFontSize: effectiveDataTableFontSize,
    sidebarTreeFontSize: effectiveSidebarTreeFontSize,
    sidebarRailScale: effectiveSidebarRailScale,
    controlHeight: Math.max(24, Math.round(32 * effectiveUiScale)),
    controlHeightSM: Math.max(20, Math.round(24 * effectiveUiScale)),
  });

  const antdTheme = useMemo(() => buildAntdTheme({
    darkMode: theme.darkMode,
    customThemeAntTokens: theme.customThemeAntTokens,
    effectiveOpacity: effectiveOpacity,
    fontFamily: 'var(--gn-font-sans, inherit)',
    fontFamilyCode: 'var(--gn-font-mono, monospace)',
    fontSize: effectiveFontSize,
    fontSizeSM: Math.max(10, Math.round(effectiveFontSize * 0.86)),
    fontSizeLG: Math.max(effectiveFontSize + 1, Math.round(effectiveFontSize * 1.14)),
    controlHeight: Math.max(24, Math.round(32 * effectiveUiScale)),
    controlHeightSM: Math.max(20, Math.round(24 * effectiveUiScale)),
    controlHeightLG: Math.max(30, Math.round(40 * effectiveUiScale)),
    motionEnabled: true,
  }), [effectiveFontSize, effectiveOpacity, effectiveUiScale, theme.customThemeAntTokens, theme.darkMode]);

  const visibleSections = useMemo(() => filterSections(GALLERY_SECTIONS, search), [search]);
  const visibleItemCount = useMemo(
    () => visibleSections.reduce((total, section) => total + section.items.length, 0),
    [visibleSections],
  );

  const handleSelectSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
    const target = document.getElementById(`component-gallery-section-${sectionId}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // 滚动高亮：取当前视口上缘最近的分区作为导航选中项。
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return undefined;
    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let current = visibleSections[0]?.id ?? '';
      for (const section of visibleSections) {
        const node = document.getElementById(`component-gallery-section-${section.id}`);
        if (!node) continue;
        if (node.getBoundingClientRect().top - containerTop <= 24) {
          current = section.id;
        }
      }
      setActiveSectionId(current);
    };
    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [visibleSections]);

  return (
    <ConfigProvider locale={getAntdLocale(language)} theme={antdTheme}>
      <App>
        <CustomThemeStyleHost
          contextKey={theme.contextKey}
          onAntTokensChange={theme.onAntTokensChange}
          themeOverride={theme.activePreset}
          onDeactivate={theme.reset}
        />
        <div className="gonavi-component-gallery-root">
          <GalleryToolbar
            theme={theme}
            uiLayoutMode={uiLayoutMode}
            onUiLayoutModeChange={setUiLayoutMode}
            search={search}
            onSearchChange={setSearch}
          />
          <div className="gonavi-component-gallery-body">
            <GalleryNav
              sections={visibleSections}
              activeSectionId={activeSectionId}
              onSelect={handleSelectSection}
              itemCount={visibleItemCount}
            />
            <main className="gonavi-component-gallery-content" ref={contentRef}>
              {visibleSections.length === 0 ? (
                <p className="gonavi-component-gallery-empty">{t('gallery.search.empty')}</p>
              ) : visibleSections.map((section) => (
                <GallerySection key={section.id} section={section} />
              ))}
            </main>
          </div>
        </div>
      </App>
    </ConfigProvider>
  );
};

export default GalleryApp;
