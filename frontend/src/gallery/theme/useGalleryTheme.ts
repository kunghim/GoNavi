import { useCallback, useMemo, useState } from 'react';
import {
  BUILTIN_CUSTOM_THEME_PRESETS,
  type BuiltinCustomThemePreset,
} from '../../utils/customThemePresets';
import {
  extractCustomThemeAntTokens,
  type CustomThemeAntTokens,
} from '../../utils/customTheme';
import type { CustomThemeAntTokenSnapshot } from '../../components/theme/CustomThemeStyleHost';

// 画廊的主题选择：基线明暗，或 17 套内置预设之一。
export type GalleryThemeSelection =
  | { kind: 'base'; mode: 'light' | 'dark' }
  | { kind: 'preset'; presetId: string };

export const GALLERY_THEME_QUERY_PARAM = 'galleryTheme';

// 把 URL 参数解析成主题选择。纯函数，便于单测直接覆盖各种非法输入。
export const parseGalleryThemeSelection = (raw: string | null | undefined): GalleryThemeSelection => {
  if (!raw) return { kind: 'base', mode: 'light' };
  if (raw === 'base:light') return { kind: 'base', mode: 'light' };
  if (raw === 'base:dark') return { kind: 'base', mode: 'dark' };
  if (BUILTIN_CUSTOM_THEME_PRESETS.some((preset) => preset.id === raw)) {
    return { kind: 'preset', presetId: raw };
  }
  return { kind: 'base', mode: 'light' };
};

// 把主题选择序列化回 URL 参数值，与 parseGalleryThemeSelection 互为逆运算。
export const serializeGalleryThemeSelection = (selection: GalleryThemeSelection): string => (
  selection.kind === 'base' ? `base:${selection.mode}` : selection.presetId
);

const readInitialSelection = (): GalleryThemeSelection => {
  if (typeof window === 'undefined') return { kind: 'base', mode: 'light' };
  try {
    const raw = new URLSearchParams(window.location.search).get(GALLERY_THEME_QUERY_PARAM);
    return parseGalleryThemeSelection(raw);
  } catch {
    // URL 解析失败时回落到浅色基线。
    return { kind: 'base', mode: 'light' };
  }
};

const syncSelectionToUrl = (selection: GalleryThemeSelection): void => {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set(GALLERY_THEME_QUERY_PARAM, serializeGalleryThemeSelection(selection));
    window.history.replaceState(null, '', url.toString());
  } catch {
    // history 不可用时不影响主题切换本身。
  }
};

export type GalleryThemeApi = {
  selection: GalleryThemeSelection;
  darkMode: boolean;
  // 供 ConfigProvider 使用的自定义主题 token（与主应用同源）。
  customThemeAntTokens: CustomThemeAntTokens;
  // 当前生效的内置预设；基线模式下为 null。
  activePreset: BuiltinCustomThemePreset | null;
  presets: readonly BuiltinCustomThemePreset[];
  // 供 CustomThemeStyleHost 使用的上下文键，必须与主应用保持同一构成。
  contextKey: string;
  onAntTokensChange: (snapshot: CustomThemeAntTokenSnapshot | null) => void;
  selectBase: (mode: 'light' | 'dark') => void;
  selectPreset: (presetId: string) => void;
  reset: () => void;
};

// useGalleryTheme 复刻主应用的主题解析链路：
// 预设自带 baseMode，选中预设时明暗基线跟随预设；
// AntD token 优先取浏览器计算级（与主应用的 CustomThemeStyleHost 同一来源），
// 计算级尚未就绪时回退到 CSS 文本解析级。
// 主题选择是画廊自己的局部状态，不写入全局自定义主题 store，
// 避免在画廊里挑主题影响主应用已保存的外观。
export const useGalleryTheme = (): GalleryThemeApi => {
  const [selection, setSelection] = useState<GalleryThemeSelection>(readInitialSelection);
  const [snapshot, setSnapshot] = useState<CustomThemeAntTokenSnapshot | null>(null);

  const activePreset = useMemo<BuiltinCustomThemePreset | null>(() => {
    if (selection.kind !== 'preset') return null;
    return BUILTIN_CUSTOM_THEME_PRESETS.find((preset) => preset.id === selection.presetId) ?? null;
  }, [selection]);

  // 选中预设时明暗基线跟随预设自身的 baseMode；基线模式用用户选的明暗。
  const mode = selection.kind === 'base'
    ? selection.mode
    : (activePreset?.baseMode ?? 'light');
  const darkMode = mode === 'dark';
  const contextKey = `${mode}:v2`;

  const sourceTokens = useMemo<CustomThemeAntTokens>(
    () => (activePreset ? extractCustomThemeAntTokens(activePreset.css) : {}),
    [activePreset],
  );

  const customThemeAntTokens = activePreset
    && snapshot?.themeId === activePreset.id
    && snapshot.themeRevision === activePreset.updatedAt
    && snapshot.contextKey === contextKey
    ? snapshot.tokens
    : sourceTokens;

  const onAntTokensChange = useCallback((next: CustomThemeAntTokenSnapshot | null) => {
    setSnapshot(next);
  }, []);

  const selectBase = useCallback((next: 'light' | 'dark') => {
    setSelection({ kind: 'base', mode: next });
    syncSelectionToUrl({ kind: 'base', mode: next });
  }, []);

  const selectPreset = useCallback((presetId: string) => {
    setSelection({ kind: 'preset', presetId });
    syncSelectionToUrl({ kind: 'preset', presetId });
  }, []);

  const reset = useCallback(() => {
    setSelection({ kind: 'base', mode: 'light' });
    syncSelectionToUrl({ kind: 'base', mode: 'light' });
  }, []);

  return {
    selection,
    darkMode,
    customThemeAntTokens,
    activePreset,
    presets: BUILTIN_CUSTOM_THEME_PRESETS,
    contextKey,
    onAntTokensChange,
    selectBase,
    selectPreset,
    reset,
  };
};
