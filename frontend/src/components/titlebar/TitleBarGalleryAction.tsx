import React from 'react';
import { BrowserOpenURL } from '../../../wailsjs/runtime';
import { useI18n } from '../../i18n/provider';

// 画廊是独立的 Vite 入口，开发态下由 Vite 服务提供。
export const GALLERY_DEV_PATH = '/gallery.html';

// 解析画廊的绝对地址。
// 桌面端开发态下应用自身跑在 Wails 代理端口上，浏览器开发态下跑在 Vite 端口上；
// 两者都用「当前页同源 + /gallery.html」推导，避免把端口写死。
export const resolveGalleryDevUrl = (href?: string): string => {
  const base = href ?? (typeof window !== 'undefined' ? window.location.href : '');
  try {
    return new URL(GALLERY_DEV_PATH, base).toString();
  } catch {
    return GALLERY_DEV_PATH;
  }
};

// 打开前端组件画廊（仅开发态挂载）。
// 画廊本身是独立入口（frontend/gallery.html），不在生产构建内；
// 这个入口只在 import.meta.env.DEV 下渲染，发布版不会出现。
export default function TitleBarGalleryAction() {
  const { t } = useI18n();
  const label = t('gallery.action.open');
  const title = t('gallery.action.open_title');
  return (
    <button
      type="button"
      className="gn-v2-titlebar-quick-action"
      data-gonavi-component-gallery-action="true"
      data-no-titlebar-toggle="true"
      aria-label={title}
      title={title}
      onClick={() => {
        const url = resolveGalleryDevUrl();
        try {
          BrowserOpenURL(url);
        } catch {
          if (typeof window !== 'undefined' && typeof window.open === 'function') {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }
      }}
    >
      <span className="gn-titlebar-toolbar-item-icon" data-titlebar-toolbar-icon="gallery" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.2" y="4.2" width="7.6" height="7.6" rx="1.6" />
          <rect x="13.2" y="4.2" width="7.6" height="7.6" rx="1.6" />
          <rect x="3.2" y="14.2" width="7.6" height="5.6" rx="1.6" />
          <rect x="13.2" y="14.2" width="7.6" height="5.6" rx="1.6" />
        </svg>
      </span>
      <span className="gn-titlebar-toolbar-item-label">{label}</span>
    </button>
  );
}
