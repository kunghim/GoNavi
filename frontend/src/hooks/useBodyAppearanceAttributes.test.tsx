/** @vitest-environment jsdom */

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  useBodyAppearanceAttributes,
  type BodyAppearanceAttributesInput,
} from './useBodyAppearanceAttributes';

// 行为测试：body 属性与 --gn-* 变量是 V2 样式的唯一开关，
// 少设一个就会整片样式失效，所以逐项断言实际落到 DOM 上的值。
const baseInput: BodyAppearanceAttributesInput = {
  darkMode: false,
  documentPlatform: 'browser',
  uiLayoutMode: 'classic',
  showDataTableCheckboxColumn: null,
  fontSize: 14,
  uiFontFamily: 'var(--gn-font-sans, inherit)',
  monoFontFamily: 'var(--gn-font-mono, monospace)',
  uiScale: 1,
  opacity: 1,
  dataTableFontSize: 14,
  sidebarTreeFontSize: 14,
  sidebarRailScale: 1,
  controlHeight: 32,
  controlHeightSM: 24,
};

const Harness: React.FC<{ input: Partial<BodyAppearanceAttributesInput> }> = ({ input }) => {
  useBodyAppearanceAttributes({ ...baseInput, ...input });
  return null;
};

describe('useBodyAppearanceAttributes', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.removeAttribute('data-theme');
    document.body.removeAttribute('data-ui-version');
    document.body.removeAttribute('data-ui-layout');
    document.body.removeAttribute('data-grid-selection-checkbox');
    document.body.removeAttribute('data-platform');
    document.body.removeAttribute('style');
    document.documentElement.removeAttribute('style');
    delete (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
  });

  const render = async (input: Partial<BodyAppearanceAttributesInput> = {}) => {
    await act(async () => {
      root.render(<Harness input={input} />);
    });
  };

  it('always sets the V2 scope so structural styles are not silently disabled', async () => {
    await render();
    expect(document.body.getAttribute('data-ui-version')).toBe('v2');
  });

  it('maps dark mode onto the body theme attribute and the color scheme', async () => {
    await render({ darkMode: true });
    expect(document.body.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');

    await render({ darkMode: false });
    expect(document.body.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('falls back to the classic layout for unknown layout values', async () => {
    await render({ uiLayoutMode: 'navicat' });
    expect(document.body.getAttribute('data-ui-layout')).toBe('navicat');

    await render({ uiLayoutMode: 'classic' });
    expect(document.body.getAttribute('data-ui-layout')).toBe('classic');
  });

  it('encodes the selection column shape as true / false / layout', async () => {
    await render({ showDataTableCheckboxColumn: true });
    expect(document.body.getAttribute('data-grid-selection-checkbox')).toBe('true');

    await render({ showDataTableCheckboxColumn: false });
    expect(document.body.getAttribute('data-grid-selection-checkbox')).toBe('false');

    await render({ showDataTableCheckboxColumn: null });
    expect(document.body.getAttribute('data-grid-selection-checkbox')).toBe('layout');
  });

  it('publishes the platform so platform-specific styles can branch', async () => {
    await render({ documentPlatform: 'windows' });
    expect(document.body.getAttribute('data-platform')).toBe('windows');
  });

  it('publishes the global scale, opacity and font variables', async () => {
    await render({ fontSize: 16, uiScale: 1.15, opacity: 0.9 });

    expect(document.body.style.fontSize).toBe('16px');
    expect(document.documentElement.style.getPropertyValue('--gonavi-font-size')).toBe('16px');
    expect(document.documentElement.style.getPropertyValue('--gn-font-size')).toBe('16px');
    expect(document.documentElement.style.getPropertyValue('--gn-font-size-sm')).toBe('14px');
    expect(document.documentElement.style.getPropertyValue('--gn-font-size-xs')).toBe('12px');
    expect(document.documentElement.style.getPropertyValue('--gn-ui-scale')).toBe('1.15');
    expect(document.documentElement.style.getPropertyValue('--gn-window-opacity')).toBe('0.9');
    expect(document.documentElement.style.getPropertyValue('--gn-window-opacity-percent')).toBe('90%');
    expect(document.documentElement.style.getPropertyValue('--gn-control-height')).toBe('32px');
    expect(document.documentElement.style.getPropertyValue('--gn-control-height-sm')).toBe('24px');
  });

  it('keeps the font families on both the body and the document element', async () => {
    await render();
    expect(document.body.style.getPropertyValue('--gn-font-sans')).toBe('var(--gn-font-sans, inherit)');
    expect(document.body.style.getPropertyValue('--gn-font-mono')).toBe('var(--gn-font-mono, monospace)');
    expect(document.documentElement.style.getPropertyValue('--gn-font-sans')).toBe('var(--gn-font-sans, inherit)');
    expect(document.documentElement.style.getPropertyValue('--gn-font-mono')).toBe('var(--gn-font-mono, monospace)');
  });
});
