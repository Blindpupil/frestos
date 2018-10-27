// Handle errors and alerts

export default {
  state: {
    error: {}
  },
  getters: {
    error: state => state.error
  },
  actions: {},
  mutations: {
    setError(state, err) {
      state.error = err
    },
    clearError(state) {
      state.error = {}
    }
  }
}
