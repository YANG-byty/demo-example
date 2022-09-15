import Vue from 'vue';
import App from './App';
import dayjs from 'dayjs';
import '@babel/polyfill';
import plugins from '@/plugins';
import store from '@/store/index';
import ViewUI from 'view-design';
import iViewPro from '@/libs/iview-pro/iview-pro.min.js';
import router from './router';
import './libs/iview-pro/iview-pro.css';
import 'view-design/dist/styles/iview.css';

import '@/styles/index.less';
import element from './elementIndex';
import Directive from '@/libs/directive';
import dataV from '@jiaminghi/data-view';
import globalComponent from '@/components/global';
import messageLImit from '@/plugins/message/message-limit.js';

Vue.prototype.Message = messageLImit;
Vue.use(globalComponent);
Vue.use(dataV);
Vue.use(plugins);
Vue.use(ViewUI);
Vue.use(element);
Vue.use(Directive);
// import VConsole from 'vconsole';
// new VConsole();
Vue.use(iViewPro);

Vue.filter('dateformat', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(dataStr).format(pattern);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    // 加载用户登录的数据
    this.$store.dispatch('admin/account/load');
  }
}).$mount('#app');
