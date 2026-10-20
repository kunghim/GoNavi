import type { SavedConnection } from '../../types';

// 画廊用的示例连接。字段与 SavedConnection 保持一致，
// 保证组件读到的形状与主应用真实数据同构。
export const GALLERY_CONNECTIONS: SavedConnection[] = [
  {
    id: 'gallery-mysql',
    name: 'MySQL · Analytics',
    createdAt: 1_700_000_000_000,
    environmentType: 'production',
    config: {
      id: 'gallery-mysql',
      type: 'mysql',
      host: '10.20.30.41',
      port: 3306,
      user: 'analyst',
      database: 'analytics',
    },
  },
  {
    id: 'gallery-postgres',
    name: 'PostgreSQL · Orders',
    createdAt: 1_700_000_100_000,
    environmentType: 'test',
    config: {
      id: 'gallery-postgres',
      type: 'postgresql',
      host: '10.20.30.42',
      port: 5432,
      user: 'orders',
      database: 'orders',
    },
  },
  {
    id: 'gallery-redis',
    name: 'Redis · Sessions',
    createdAt: 1_700_000_200_000,
    environmentType: 'local',
    config: {
      id: 'gallery-redis',
      type: 'redis',
      host: '127.0.0.1',
      port: 6379,
      user: '',
      database: '0',
    },
  },
];
