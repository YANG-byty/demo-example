import { removeAccessToken } from '@/api/login.js';
import util from '@/libs/util';
import { authLogout } from '@/api/redirect';
export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {}
  },
  actions: {
    loginout() {
      removeAccessToken().then(() => {
        util.cookies.remove('token');
        util.cookies.remove('nick_name');
        util.cookies.remove('token_type');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = authLogout();
      });
    }
  }
};
