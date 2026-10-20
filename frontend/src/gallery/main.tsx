import React from 'react';
import ReactDOM from 'react-dom/client';
import GalleryApp from './GalleryApp';
import { I18nProvider } from '../i18n/provider';
import { loadCatalog } from '../i18n/catalog';
import { setCurrentLanguage } from '../i18n';
import { useStore } from '../store';
import { installBrowserMockRuntime } from '../dev/browserMock/installBrowserMockRuntime';
import { seedGalleryStore } from './fixtures/seedGalleryStore';

// 样式层：与主应用同一套 CSS 管道，画廊里看到的即是产品里的样式。
import '../App.css';
import '../v2-theme.css';
import '../styles/v2-theme-workbench.css';
import '../styles/navicatTheme.css';
import '../styles/v2-theme-ai.css';

const rootNode = document.getElementById('gallery-root');
if (!rootNode) {
  throw new Error('gallery root node is missing');
}

// 浏览器 mock 运行时：让组件直接调 Wails 绑定时不会抛错。
installBrowserMockRuntime();

const readBrowserLanguages = (): string[] => {
  if (typeof navigator === 'undefined') return [];
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    return [...navigator.languages];
  }
  return navigator.language ? [navigator.language] : [];
};

const renderGallery = async (): Promise<void> => {
  const languagePreference = useStore.getState().languagePreference;
  const systemLanguages = readBrowserLanguages();
  // setCurrentLanguage 要先设：组件里直接调 t() 的地方（不走 React context）依赖它。
  const language = setCurrentLanguage(languagePreference, systemLanguages);
  await loadCatalog(language);
  await seedGalleryStore();
  ReactDOM.createRoot(rootNode).render(
    <React.StrictMode>
      <I18nProvider
        preference={languagePreference}
        systemLanguages={systemLanguages}
        onPreferenceChange={(preference) => {
          useStore.getState().setLanguagePreference(preference);
        }}
      >
        <GalleryApp />
      </I18nProvider>
    </React.StrictMode>,
  );
};

void renderGallery();
