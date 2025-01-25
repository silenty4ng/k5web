import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/chirp',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'base',
      name: 'Workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'channel',
      name: 'Channel',
      component: () => import('@/views/list/search-table/index.vue'),
      meta: {
        locale: 'menu.cps.channel',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'radio',
      name: 'Radio',
      component: () => import('@/views/list/radio/index.vue'),
      meta: {
        locale: 'menu.cps.radio',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'mdc',
      name: 'Mdc',
      component: () => import('@/views/list/mdc/index.vue'),
      meta: {
        locale: 'menu.cps.mdc',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'dtmf',
      name: 'Dtmf',
      component: () => import('@/views/list/dtmf/index.vue'),
      meta: {
        locale: 'menu.cps.dtmf',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'settings',
      name: 'Settings',
      component: () => import('@/views/list/settings/index.vue'),
      meta: {
        locale: 'menu.cps.settings',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'thanks',
      name: 'Thanks',
      component: () => import('@/views/thanks/index.vue'),
      meta: {
        hideInMenu: true,
        locale: '感谢列表',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};

export default DASHBOARD;
