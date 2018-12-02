// Handle errors and alerts

export default {
  state: {
    error: {},
    success: ''
  },
  getters: {
    error: state => state.error,
    success: state => state.success
  },
  actions: {},
  mutations: {
    setError(state, err) {
      state.error = err
    },
    setSuccess(state, message) {
      state.success = message
    },
    clearError(state) {
      state.error = {}
    }
  }
}
