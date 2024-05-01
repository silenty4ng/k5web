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
      path: 'backup',
      name: 'Backup',
      component: () => import('@/views/list/card/index.vue'),
      meta: {
        locale: '备份/还原',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'flash',
      name: 'Flash',
      component: () => import('@/views/list/flash/index.vue'),
      meta: {
        locale: '固件升级',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'image',
      name: 'Image',
      component: () => import('@/views/list/image/index.vue'),
      meta: {
        locale: '开机图片',
        requiresAuth: true,
        roles: ['*'],
      },
    },
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
      path: 'sat',
      name: 'Sat',
      component: () => import('@/views/list/sat/index.vue'),
      meta: {
        locale: '星历写入',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};

export default LIST;
