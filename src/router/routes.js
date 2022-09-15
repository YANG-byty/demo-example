/**
 * 在主框架内显示
 */

const frameIn = [
  {
    path: '/',
    name: '公权力大数据监督应用大屏',
    meta: {
      title: '公权力大数据监督应用大屏'
    },
    component: () => import('@/pages/index.vue')
    // component: () => import('@/pages/home/index.vue')
  },
  {
    path: '/canvas',
    name: 'canvas',
    meta: {
      title: 'canvas'
    },
    component: () => import('@/pages/canvas/index.vue')
  }
  // {
  //   path: '/sport',
  //   name: '丽水市体育领域大数据监督应用',
  //   meta: {
  //     title: '丽水市体育领域大数据监督应用'
  //   },
  //   component: () => import('@/pages/sport/index.vue')
  // },
  // {
  //   path: '/forestry',
  //   name: '丽水市林业领域大数据监督应用',
  //   meta: {
  //     title: '丽水市林业领域大数据监督应用'
  //   },
  //   component: () => import('@/pages/forestry/index.vue')
  // }
];

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      noAuth: true
    },
    component: () => import('@/pages/login/index.vue')
  }
];
/**
 * 错误页面
 */

const errorPage = [
  {
    path: '/403',
    name: '403',
    meta: {
      title: '403',
      noAuth: true
    },
    component: () => import('@/pages/system/error/403')
  },
  {
    path: '/500',
    name: '500',
    meta: {
      title: '500',
      noAuth: true
    },
    component: () => import('@/pages/system/error/500')
  },
  {
    path: '*',
    name: '404',
    meta: {
      title: '404',
      noAuth: true
    },
    component: () => import('@/pages/system/error/404')
  }
];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

// 重新组织后导出
export default [...frameIn, ...frameOut, ...errorPage];
