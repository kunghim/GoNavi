import React, { useMemo, useCallback } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { buildAntdTheme, resolveAntdPrimaryBgColor, resolveAntdPrimaryColor } from '../antdThemeBuilder';
import { useStore } from '../../store';
import {
  detectRuntimeCapabilityCached,
  resolveLowSpecModeActive,
  shouldReduceMotion,
} from '../../utils/runtimeCapability';
import {
  type SidebarTableMetadataField,
  setSidebarTableMetadataFieldSelected,
  applySidebarTableMetadataFieldOrder,
} from '../../utils/sidebarTableMetadata';
import type { AppCoreStateApi } from './useAppCoreState';
import type { AppShellStateApi } from './useAppShellState';
import type { AppProxySettingsApi } from './useAppProxySettings';

export interface UseAppAntdThemeInput {
  isLinuxRuntime: AppCoreStateApi['isLinuxRuntime'];
  customThemeAntTokens: AppCoreStateApi['customThemeAntTokens'];
  darkMode: AppCoreStateApi['darkMode'];
  tokenFontSize: AppCoreStateApi['tokenFontSize'];
  tokenFontSizeSM: AppCoreStateApi['tokenFontSizeSM'];
  tokenFontSizeLG: AppCoreStateApi['tokenFontSizeLG'];
  resolvedUiFontFamily: AppShellStateApi['resolvedUiFontFamily'];
  resolvedMonoFontFamily: AppShellStateApi['resolvedMonoFontFamily'];
  tokenControlHeight: AppCoreStateApi['tokenControlHeight'];
  tokenControlHeightSM: AppCoreStateApi['tokenControlHeightSM'];
  tokenControlHeightLG: AppCoreStateApi['tokenControlHeightLG'];
  effectiveOpacity: AppShellStateApi['effectiveOpacity'];
  linuxCJKFontInstallHint: AppShellStateApi['linuxCJKFontInstallHint'];
  hasLoadedInstalledFontsRef: AppShellStateApi['hasLoadedInstalledFontsRef'];
  isFontFamiliesLoading: AppShellStateApi['isFontFamiliesLoading'];
  fontFamiliesLoadError: AppShellStateApi['fontFamiliesLoadError'];
  isLinuxCJKFontBannerDismissed: AppProxySettingsApi['isLinuxCJKFontBannerDismissed'];
  t: AppCoreStateApi['t'];
  sidebarTableMetadataFieldOrder: AppCoreStateApi['sidebarTableMetadataFieldOrder'];
  setQueryOptions: AppCoreStateApi['setQueryOptions'];
  sidebarTableMetadataFields: AppCoreStateApi['sidebarTableMetadataFields'];
}

export const useAppAntdTheme = ({
  isLinuxRuntime, customThemeAntTokens, darkMode, tokenFontSize, tokenFontSizeSM, tokenFontSizeLG,
  resolvedUiFontFamily, resolvedMonoFontFamily, tokenControlHeight, tokenControlHeightSM,
  tokenControlHeightLG, effectiveOpacity, linuxCJKFontInstallHint, hasLoadedInstalledFontsRef,
  isFontFamiliesLoading, fontFamiliesLoadError, isLinuxCJKFontBannerDismissed, t,
  sidebarTableMetadataFieldOrder, setQueryOptions, sidebarTableMetadataFields,
}: UseAppAntdThemeInput) => {
  const linuxResizeHandleStyleBase = {
      position: 'fixed',
      zIndex: 12000,
      background: 'transparent',
      WebkitAppRegion: 'drag',
      '--wails-draggable': 'drag',
      userSelect: 'none'
  } as any;

  const showLinuxResizeHandles = isLinuxRuntime;
  const resizeGuideColor = 'var(--gn-accent, #16a34a)';
  // Navicat 布局模式与 classic 共用品牌绿主色；用户选了自定义主题时以自定义为准。
  // 回退口径与 antdThemeBuilder 共用同一份，避免两处各写一套后漂移。
  const v2AntPrimaryColor = resolveAntdPrimaryColor(customThemeAntTokens, darkMode);
  const v2AntPrimaryBgColor = resolveAntdPrimaryBgColor(customThemeAntTokens, darkMode);
  // 低配档位 / 减少动画：antd 组件动画（Modal / Drawer / Dropdown / Select 等）的总开关。
  // 与 useAppLayoutEffects 的 body 类同源同判定，避免 antd 动与自定义 CSS 动画出现两套口径。
  const lowSpecModePreference = useStore((state) => state.appearance.lowSpecMode);
  const reduceMotionPreference = useStore((state) => state.appearance.reduceMotion);
  const antdMotionEnabled = !shouldReduceMotion(
      reduceMotionPreference,
      resolveLowSpecModeActive(lowSpecModePreference, detectRuntimeCapabilityCached().lowSpec),
  );
  // token 映射集中在 appShell/antdThemeBuilder，主应用与组件画廊共用同一份推导。
  const antdTheme = useMemo(() => buildAntdTheme({
    darkMode,
    customThemeAntTokens,
    effectiveOpacity,
    fontFamily: resolvedUiFontFamily,
    fontFamilyCode: resolvedMonoFontFamily,
    fontSize: tokenFontSize,
    fontSizeSM: tokenFontSizeSM,
    fontSizeLG: tokenFontSizeLG,
    controlHeight: tokenControlHeight,
    controlHeightSM: tokenControlHeightSM,
    controlHeightLG: tokenControlHeightLG,
    motionEnabled: antdMotionEnabled,
  }), [
      darkMode,
      customThemeAntTokens,
      effectiveOpacity,
      antdMotionEnabled,
      tokenControlHeight,
      tokenControlHeightLG,
      tokenControlHeightSM,
      tokenFontSize,
      tokenFontSizeLG,
      tokenFontSizeSM,
      resolvedMonoFontFamily,
      resolvedUiFontFamily,
  ]);
  const showLinuxCJKFontBanner = Boolean(
      linuxCJKFontInstallHint &&
      hasLoadedInstalledFontsRef.current &&
      !isFontFamiliesLoading &&
      !fontFamiliesLoadError &&
      !isLinuxCJKFontBannerDismissed,
  );
  const sidebarMetadataFieldItems = useMemo(() => {
      const labelByField: Record<SidebarTableMetadataField, string> = {
          comment: t('sidebar.v2_table_group_menu.show_table_comments'),
          rows: t('sidebar.v2_table_group_menu.display_table_rows'),
          size: t('sidebar.v2_table_group_menu.display_table_size'),
          createdAt: t('sidebar.v2_table_group_menu.display_create_time'),
          updatedAt: t('sidebar.v2_table_group_menu.display_update_time'),
      };
      return sidebarTableMetadataFieldOrder.map((field) => ({
          field,
          label: labelByField[field],
      }));
  }, [sidebarTableMetadataFieldOrder, t]);
  const toggleSidebarMetadataFieldFromSettings = useCallback((field: SidebarTableMetadataField, selected: boolean) => {
      setQueryOptions({
          sidebarTableMetadataFields: setSidebarTableMetadataFieldSelected(
              sidebarTableMetadataFields,
              field,
              selected,
              sidebarTableMetadataFieldOrder,
          ),
      });
  }, [setQueryOptions, sidebarTableMetadataFieldOrder, sidebarTableMetadataFields]);
  const handleSidebarMetadataDragEnd = useCallback((event: DragEndEvent) => {
      const activeField = String(event.active.id || '') as SidebarTableMetadataField;
      const overField = String(event.over?.id || '') as SidebarTableMetadataField;
      if (!overField || activeField === overField) {
          return;
      }
      const currentOrder = sidebarMetadataFieldItems.map((item) => item.field);
      const activeIndex = currentOrder.indexOf(activeField);
      const overIndex = currentOrder.indexOf(overField);
      if (activeIndex < 0 || overIndex < 0) {
          return;
      }
      const nextOrder = arrayMove(currentOrder, activeIndex, overIndex);
      setQueryOptions({
          sidebarTableMetadataFieldOrder: nextOrder,
          sidebarTableMetadataFields: applySidebarTableMetadataFieldOrder(
              sidebarTableMetadataFields,
              nextOrder,
          ),
      });
  }, [setQueryOptions, sidebarMetadataFieldItems, sidebarTableMetadataFields]);
  return {
    linuxResizeHandleStyleBase, showLinuxResizeHandles, resizeGuideColor, v2AntPrimaryColor,
    v2AntPrimaryBgColor, antdTheme, showLinuxCJKFontBanner,
    sidebarMetadataFieldItems, toggleSidebarMetadataFieldFromSettings, handleSidebarMetadataDragEnd,
  };
};

export type AppAntdThemeApi = ReturnType<typeof useAppAntdTheme>;
