import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const IDEA: AppRouteRecordRaw = {
  path: '/idea',
  name: 'idea',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.workshop',
    requiresAuth: true,
    icon: 'icon-list',
    order: 3,
  },
  children: [
    {
      path: 'firmware',
      name: 'ideaFirmware',
      component: () => import('@/views/idea/firmware/index.vue'),
      meta: {
        locale: 'menu.firmware',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'Image',
      name: 'ideaImage',
      component: () => import('@/views/idea/image/index.vue'),
      meta: {
        locale: 'menu.image',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'losehu',
      name: 'ideaLosehu',
      component: () => import('@/views/idea/losehu/index.vue'),
      meta: {
        locale: 'idea.diy',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default IDEA;
