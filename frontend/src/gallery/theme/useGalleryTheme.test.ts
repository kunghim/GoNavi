import { describe, expect, it } from 'vitest';
import { BUILTIN_CUSTOM_THEME_PRESETS } from '../../utils/customThemePresets';
import {
  GALLERY_THEME_QUERY_PARAM,
  parseGalleryThemeSelection,
  serializeGalleryThemeSelection,
  type GalleryThemeSelection,
} from './useGalleryTheme';

describe('gallery theme selection parsing', () => {
  it('基线明暗可以双向序列化', () => {
    const light: GalleryThemeSelection = { kind: 'base', mode: 'light' };
    const dark: GalleryThemeSelection = { kind: 'base', mode: 'dark' };
    expect(serializeGalleryThemeSelection(light)).toBe('base:light');
    expect(serializeGalleryThemeSelection(dark)).toBe('base:dark');
    expect(parseGalleryThemeSelection('base:light')).toEqual(light);
    expect(parseGalleryThemeSelection('base:dark')).toEqual(dark);
  });

  it('合法预设 id 解析成 preset 选择', () => {
    const preset = BUILTIN_CUSTOM_THEME_PRESETS[0];
    expect(preset).toBeDefined();
    expect(parseGalleryThemeSelection(preset.id)).toEqual({ kind: 'preset', presetId: preset.id });
  });

  it('未知预设 id 回落到浅色基线', () => {
    expect(parseGalleryThemeSelection('builtin-not-a-real-preset')).toEqual({ kind: 'base', mode: 'light' });
  });

  it('空值与非字符串输入回落到浅色基线', () => {
    expect(parseGalleryThemeSelection(null)).toEqual({ kind: 'base', mode: 'light' });
    expect(parseGalleryThemeSelection(undefined)).toEqual({ kind: 'base', mode: 'light' });
    expect(parseGalleryThemeSelection('')).toEqual({ kind: 'base', mode: 'light' });
  });

  it('每个内置预设都能原样往返', () => {
    for (const preset of BUILTIN_CUSTOM_THEME_PRESETS) {
      const selection = parseGalleryThemeSelection(preset.id);
      expect(selection).toEqual({ kind: 'preset', presetId: preset.id });
      expect(serializeGalleryThemeSelection(selection)).toBe(preset.id);
    }
  });

  it('内置预设覆盖 8 暗 9 亮共 17 套', () => {
    expect(BUILTIN_CUSTOM_THEME_PRESETS).toHaveLength(17);
    const modes = BUILTIN_CUSTOM_THEME_PRESETS.map((preset) => preset.baseMode);
    expect(modes.filter((mode) => mode === 'dark')).toHaveLength(8);
    expect(modes.filter((mode) => mode === 'light')).toHaveLength(9);
  });

  it('预设 id 互不重复', () => {
    const ids = BUILTIN_CUSTOM_THEME_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('URL 参数名固定为 galleryTheme', () => {
    expect(GALLERY_THEME_QUERY_PARAM).toBe('galleryTheme');
  });
});
