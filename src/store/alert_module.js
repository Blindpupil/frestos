// Handle errors and alerts
import {
  CLEAR_ERROR,
  SET_ERROR,
  SET_SUCCESS
} from '@/store/types/mutation_types'

export default {
  state: {
    error: { code: '', message: '' },
    success: ''
  },
  getters: {
    error: state => state.error,
    success: state => state.success
  },
  actions: {},
  mutations: {
    [SET_SUCCESS](state, message) {
      state.success = message
    },
    [CLEAR_ERROR](state) {
      state.error = {}
    },
    [SET_ERROR](state, err) {
      state.error = err
    }
  }
}
