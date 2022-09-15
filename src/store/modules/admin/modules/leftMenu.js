export default {
  namespaced: true,
  state: {
    menuList: []
  },
  mutations: {
    setMenuList(state, list) {
      state.menuList = list;
    }
  },
  actions: {}
};
