import { useLayoutEffect } from 'react';

// body 外观属性与全局 CSS 变量的统一入口。
//
// V2 结构样式全部以 `body[data-ui-version="v2"]` 为作用域，明暗基线由
// `body[data-theme]` 决定，布局形态由 `body[data-ui-layout]` 决定；
// 字号、缩放、透明度等则以 `--gn-*` 变量下发。
// 少设一个属性就会整片样式失效，因此主应用与组件画廊
// （frontend/src/gallery）必须走同一份实现，不能各写一套。
export type BodyAppearanceAttributesInput = {
  darkMode: boolean;
  documentPlatform: string;
  uiLayoutMode: 'classic' | 'navicat';
  // 行首选择列形态：true = 复选框，false = 隐藏，null = 跟随布局。
  showDataTableCheckboxColumn: boolean | null;
  fontSize: number;
  uiFontFamily: string;
  monoFontFamily: string;
  uiScale: number;
  opacity: number;
  dataTableFontSize: number;
  sidebarTreeFontSize: number;
  sidebarRailScale: number;
  controlHeight: number;
  controlHeightSM: number;
};

export const useBodyAppearanceAttributes = ({
  darkMode,
  documentPlatform,
  uiLayoutMode,
  showDataTableCheckboxColumn,
  fontSize,
  uiFontFamily,
  monoFontFamily,
  uiScale,
  opacity,
  dataTableFontSize,
  sidebarTreeFontSize,
  sidebarRailScale,
  controlHeight,
  controlHeightSM,
}: BodyAppearanceAttributesInput): void => {
  // Apply the document theme before the first paint. V2 structural styles are
  // scoped by data-ui-version; a passive effect leaves one unstyled titlebar
  // frame where the centered context and its marker collapse into the legacy
  // flex layout.
  useLayoutEffect(() => {
    document.body.style.backgroundColor = 'transparent';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.body.setAttribute('data-ui-version', 'v2');
    document.body.setAttribute('data-ui-layout', uiLayoutMode === 'navicat' ? 'navicat' : 'classic');
    document.body.setAttribute('data-grid-selection-checkbox',
      showDataTableCheckboxColumn === true ? 'true'
        : showDataTableCheckboxColumn === false ? 'false' : 'layout');
    document.body.setAttribute('data-platform', documentPlatform);
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.setProperty('--gn-font-sans', uiFontFamily);
    document.body.style.setProperty('--gn-font-mono', monoFontFamily);
    document.documentElement.style.setProperty('--gonavi-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--gn-font-sans', uiFontFamily);
    document.documentElement.style.setProperty('--gn-font-mono', monoFontFamily);
    document.documentElement.style.setProperty('--gn-ui-scale', `${uiScale}`);
    document.documentElement.style.setProperty('--gn-window-opacity', `${opacity}`);
    document.documentElement.style.setProperty('--gn-window-opacity-percent', `${opacity * 100}%`);
    document.documentElement.style.setProperty('--gn-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--gn-font-size-sm', `${Math.max(10, Math.round(fontSize * 0.86))}px`);
    document.documentElement.style.setProperty('--gn-font-size-xs', `${Math.max(9, Math.round(fontSize * 0.76))}px`);
    document.documentElement.style.setProperty('--gn-font-size-mono', `${Math.max(10, Math.round(dataTableFontSize * 0.92))}px`);
    document.documentElement.style.setProperty('--gn-data-table-font-size', `${dataTableFontSize}px`);
    document.documentElement.style.setProperty('--gn-sidebar-tree-font-size', `${sidebarTreeFontSize}px`);
    document.documentElement.style.setProperty('--gn-sidebar-rail-scale', `${sidebarRailScale}`);
    document.documentElement.style.setProperty('--gn-control-height', `${controlHeight}px`);
    document.documentElement.style.setProperty('--gn-control-height-sm', `${controlHeightSM}px`);
  }, [
    controlHeight,
    controlHeightSM,
    darkMode,
    dataTableFontSize,
    documentPlatform,
    fontSize,
    monoFontFamily,
    opacity,
    showDataTableCheckboxColumn,
    sidebarRailScale,
    sidebarTreeFontSize,
    uiFontFamily,
    uiLayoutMode,
    uiScale,
  ]);
};
