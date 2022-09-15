import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'view-design';

import util from '@/libs/util';

import Setting from '@/setting';

// 路由数据
import routes from './routes';

Vue.use(VueRouter);

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes,
  mode: Setting.routerMode,
  base: Setting.routerBase
});

/**
 * 路由拦截
 * 权限验证
 */

router.beforeEach((to, from, next) => {
  if (Setting.showProgressBar) iView.LoadingBar.start();
  //判断是否有标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();

  // 不需要登录的页面直接放行
  // if (to.meta.noAuth) {
  //   return next();
  // }

  // const token = util.cookies.get('token');
  // if (token && token !== 'undefined') {
  //   next();
  // } else {
  //   next({
  //     name: 'login',
  //     query: {
  //       redirect: to.fullPath
  //     }
  //   });
  // }
});

router.afterEach((to) => {
  if (Setting.showProgressBar) iView.LoadingBar.finish();
  // 返回页面顶端
  window.scrollTo(0, 0);
});

export default router;
