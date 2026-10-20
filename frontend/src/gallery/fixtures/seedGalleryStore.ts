import { useStore } from '../../store';
import { GALLERY_CONNECTIONS } from './galleryConnections';

const waitForStoreHydration = async (): Promise<void> => {
  if (useStore.persist.hasHydrated()) return;
  await new Promise<void>((resolve) => {
    useStore.persist.onFinishHydration(() => resolve());
  });
};

// 把示例连接写进 zustand store。
// 画廊里不少组件从 store 读连接上下文（侧栏树、连接选择器、对象浏览器），
// 没有这些数据就只能渲染空壳。store 持久化从 localStorage 恢复，
// 因此必须在 hydrate 之后写入，否则会被持久化快照覆盖。
export const seedGalleryStore = async (): Promise<void> => {
  await waitForStoreHydration();
  useStore.getState().replaceConnections(GALLERY_CONNECTIONS);
};
