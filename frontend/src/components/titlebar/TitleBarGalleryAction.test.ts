import { describe, expect, it } from 'vitest';
import { GALLERY_DEV_PATH, resolveGalleryDevUrl } from './TitleBarGalleryAction';

describe('resolveGalleryDevUrl', () => {
  it('以当前页同源推导画廊地址，不写死端口', () => {
    expect(resolveGalleryDevUrl('http://127.0.0.1:5173/')).toBe('http://127.0.0.1:5173/gallery.html');
    expect(resolveGalleryDevUrl('http://127.0.0.1:34115/')).toBe('http://127.0.0.1:34115/gallery.html');
  });

  it('保留当前页的查询串来源但丢弃自身路径', () => {
    expect(resolveGalleryDevUrl('http://127.0.0.1:5173/index.html?devHarness=component-gallery'))
      .toBe('http://127.0.0.1:5173/gallery.html');
  });

  it('相对地址解析到同源绝对地址', () => {
    expect(resolveGalleryDevUrl('http://127.0.0.1:5174/')).toBe('http://127.0.0.1:5174/gallery.html');
  });

  it('非法地址回落到相对路径', () => {
    expect(resolveGalleryDevUrl('not a url')).toBe(GALLERY_DEV_PATH);
  });

  it('画廊路径固定为 /gallery.html', () => {
    expect(GALLERY_DEV_PATH).toBe('/gallery.html');
  });
});
