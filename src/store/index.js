import Vue from "vue";
import Vuex from "vuex";
import api from '@/api/api'


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    refresh_token: '',
    expires_in: '', // token保质期
    menus: localStorage.getItem('menus') ? localStorage.getItem('menus') : '',
    Roles: localStorage.getItem('Roles') ? localStorage.getItem('Roles') : '',
    userInfo: {},
    messageCount: 0,
    loadding: false
  },

  mutations: {
    // 修改token，并将token存入localStorage
    SET_TOKEN(state, token) {
      state.Authorization = token.Authorization;
      // localStorage.setItem('Authorization', token.Authorization);
      // localStorage.setItem('Authorization', 'Bearer '+userInfo.Authorization);
      // state.token=token
    },
    SET_REFRESH_TOKEN: (state, data) => { // 保存延续token
      state.refresh_token = data
      localStorage.setItem('refresh_token', data);

    },
    SET_EXPIRES_TIME(state, data) { // 保存token过期时间
      let NOW_DATE = parseInt(new Date().getTime() / 1000) // 保存当前登陆时间
      state.expires_in = data
      localStorage.setItem('expires_in', data);

    },
    SET_MENUS(state, data) {
      state.menus = data
    },
    SET_Roles(state, data) {
      state.Roles = data
    },
    SET_UserInfo(state, data) {
      state.userInfo = data
    },
    SET_MessageCount(state, data) {
      state.messageCount = data
    },

    // loadding
    showloadding(state, load) {
      state.loadding = load
    }
  },
  actions: {
    async loginIn({
      commit,
      state
    }, userInfo) {
      // console.log(userInfo)
      commit('SET_TOKEN', 'Bearer ' + userInfo.access_token)
      commit('SET_REFRESH_TOKEN', userInfo.refresh_token) // 保存延续token
      commit('SET_EXPIRES_TIME', userInfo.expires_in) // 保存token过期时间
      localStorage.setItem('Authorization', 'Bearer ' + userInfo.access_token);
      return true
    },
    changeMenus({
      commit,
      state
    }, Menus) {
      commit('SET_MENUS', Menus)
      // console.log(Menus)
      localStorage.setItem('menus', Menus);
    },
    changeRoles({
      commit,
      state
    }, Roles) {
      commit('SET_Roles', Roles)
      localStorage.setItem('Roles', Roles);
    },
    UserList({
      commit,
      state
    }, data) {
      commit('SET_UserInfo', data)
    },
    async MessageCount({
      commit,
      state
    }) {
      const data = await api.system.getMessageCount();
      if (data) {
        commit('SET_MessageCount', data.data)
      }
    },
    async changeMenusList({
      commit,
      state
    }) {
      let data = await api.system.getUserRouter();
      if (data.data.code == 0) {
        let arr = data.data.data.routes;
        arr.pop();
        commit('SET_MENUS', JSON.stringify(arr))
        localStorage.setItem('menus', JSON.stringify(arr));
        commit('SET_Roles', data.data.data.permissions)
        localStorage.setItem('Roles', data.data.data.permissions);
      }
    },
    setloadding(context, load) {
      context.commit("showloadding", load);
    }
  },
  modules: {},

  getters: {
    isloading: (state) => {
      return state.loadding
    }
  }
});