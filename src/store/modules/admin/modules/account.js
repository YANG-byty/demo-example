/**
 * 注册、登录、注销
 * */
import util from '@/libs/util';
import router from '@/router';
import { clientToken, getLoginUserInfo } from '@/api/login.js';
import { Modal } from 'view-design';

export default {
  namespaced: true,
  actions: {
    /**
     * @description 正常登录
     */
    login({ dispatch }, params) {
      return new Promise((resolve, reject) => {
        clientToken(params)
          .then(async (res) => {
            util.cookies.set('token', res.access_token);
            util.cookies.set('token_type', res.token_type);
            await dispatch('getUserInfo', res);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * @description 获取用户信息
     */
    getUserInfo({ dispatch }, data) {
      return new Promise((resolve, reject) => {
        getLoginUserInfo()
          .then(async (res) => {
            util.cookies.set('nick_name', res.nickName);
            // 设置用户信息
            await dispatch('admin/user/set', Object.assign(data, res), { root: true });
            await dispatch('admin/user/setAvater', res.avatar, {
              root: true
            });
            // 用户登录后从持久化数据加载一系列的设置
            await dispatch('load');
            // 结束
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * @description 退出登录
     * */
    logout({ commit, dispatch }, { confirm = false, vm } = {}) {
      async function logout() {
        // 删除cookie
        util.cookies.remove('token');
        util.cookies.remove('nick_name');
        util.cookies.remove('token_type');
        localStorage.clear();
        sessionStorage.clear();
        // 清空 vuex 用户信息
        await dispatch('admin/user/set', {}, { root: true });
        // 跳转路由
        router.push({
          name: 'login'
        });
      }

      if (confirm) {
        Modal.confirm({
          title: vm.$t('basicLayout.logout.confirmTitle'),
          content: vm.$t('basicLayout.logout.confirmContent'),
          onOk() {
            logout();
          }
        });
      } else {
        logout();
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     * @param {Object} dispatch vuex dispatch
     */
    load({ state, dispatch, commit }) {
      return new Promise(async (resolve) => {
        // 加载用户登录信息
        await dispatch('admin/user/load', null, { root: true });
        await dispatch('admin/user/loadAvatar', null, { root: true });
        // 持久化数据加载上次退出时的多页列表
        await commit('admin/user/setPlantform', null, { root: true });
        // end
        resolve();
      });
    }
  }
};
