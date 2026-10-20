import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import baseConfig from './vite.config';

// 组件画廊的独立构建配置。
//
// 为什么要单独一个配置文件，而不是在 vite.config.ts 里按 mode 分支：
//   1. 主配置的形态保持不变（普通对象），依赖它的工具与测试不受影响；
//   2. 隔离是显式的——主应用构建永远只看 vite.config.ts，
//      画廊只有显式执行 `npm run gallery` 才会构建，产物落在 dist-gallery/；
//   3. 共享部分（插件、依赖预打包、Monaco 字体目录、chunk 拆分）直接从主配置继承，
//      不复制一份，避免两处配置各自漂移。
export default defineConfig((env) => {
  const base = (typeof baseConfig === 'function'
    ? (baseConfig as (env: unknown) => UserConfig)(env)
    : baseConfig) as UserConfig;

  return mergeConfig(base, {
    server: {
      port: 5174,
    },
    build: {
      outDir: 'dist-gallery',
      emptyOutDir: true,
      rollupOptions: {
        input: fileURLToPath(new URL('./gallery.html', import.meta.url)),
      },
    },
  });
});
