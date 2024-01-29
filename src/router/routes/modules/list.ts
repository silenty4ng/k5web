import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/tool',
  name: 'list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.list',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'chi',
      name: 'Chi',
      component: () => import('@/views/list/chi/index.vue'),
      meta: {
        locale: '字库写入',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'backup',
      name: 'Backup',
      component: () => import('@/views/list/card/index.vue'),
      meta: {
        locale: '备份/还原',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
