import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const GUIDE: AppRouteRecordRaw = {
  path: '/guide',
  name: 'guide',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '指南',
    requiresAuth: true,
    icon: 'icon-list',
    order: 3,
  },
  children: [
    {
      path: 'f117',
      name: 'f117',
      component: () => import('@/views/guide/f117/index.vue'),
      meta: {
        locale: '使用117P6版',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default GUIDE;
