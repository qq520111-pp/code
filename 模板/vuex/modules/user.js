const user = {
  state: {
    userInfo: getStore({
      name: 'userInfo'
    }) || [],
  },
  actions: {
    // 登出
    LogOut({
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token
      setStore({
        name: 'token',
        content: state.token
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      if (validatenull(userInfo.avatar)) {
        // userInfo.avatar = '/img/bg/img-logo.png'
      }
      state.userInfo = userInfo
      setStore({
        name: 'userInfo',
        content: state.userInfo
      })
    },
  },
}
export default user