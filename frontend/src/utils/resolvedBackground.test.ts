import { describe, expect, it } from 'vitest';
import { resolvedBackground } from './resolvedBackground';
import { BUILTIN_BACKGROUNDS } from './builtinBackgrounds';
import { galleryInstalled } from '../backgroundGallery/testFixtures';
const image = { name: 'photo.jpg', dataUrl: 'data:image/jpeg;base64,/9j//9k=' };

describe('trusted background resolution', () => {
  it.each(BUILTIN_BACKGROUNDS)('keeps uncached legacy $id unresolved instead of loading bundled or remote bytes', builtin => {
    expect(resolvedBackground({ builtinId: builtin.id, image })).toBeNull();
    expect(builtin).not.toHaveProperty('url');
  });
  it('uses only a matching locally resolved installation and its fit', () => {
    const gallery = galleryInstalled();
    expect(resolvedBackground({ builtinId: gallery.entry.id, image: null, gallery })).toEqual({ dataUrl: gallery.url, name: gallery.entry.id, fit: 'contain' });
    expect(resolvedBackground({ builtinId: 'whale-maid-b', image: null, gallery })).toBeNull();
    expect(resolvedBackground({ builtinId: gallery.entry.id, builtinVersion: '2', image: null, gallery })).toBeNull();
    expect(resolvedBackground({ builtinId: gallery.entry.id, image: null, gallery: { ...gallery, url: 'https://evil.example/a.png' } })).toBeNull();
  });
  it('keeps uploaded JPEG validation and cover sizing', () => {
    expect(resolvedBackground({ image })).toEqual({ ...image, fit: 'cover' });
    expect(resolvedBackground({ image: null })).toBeNull();
  });
  it.each(['https://evil.example/a.webp', 'data:image/svg+xml,<svg/>', 'blob:local', '__proto__'])('cannot inject URL %s', url => {
    expect(resolvedBackground({ builtinId: url, image: null })).toBeNull();
    expect(resolvedBackground({ image: { ...image, dataUrl: url } })).toBeNull();
  });
  it('keeps the legacy catalog free of inline artwork', () => {
    // 行为级断言：目录项只带 id 与文案键，不携带任何图片字段，
    // 且在没有本地安装时解析不出任何字节。
    for (const builtin of BUILTIN_BACKGROUNDS) {
      expect(Object.keys(builtin).filter((key) => ['url', 'src', 'dataUrl', 'image', 'data'].includes(key))).toEqual([]);
      expect(resolvedBackground({ builtinId: builtin.id, image: null })).toBeNull();
    }
  });
});
