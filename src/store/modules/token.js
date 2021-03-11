const state = {
  token: null
};

const mutations = {
  CHANGE_TOKEN: (state, newVal) => (state.token = newVal)
};

const getters = {
  token: state => state.token
};
export default {
  namespaced: true,
  state,
  mutations,
  getters
};
