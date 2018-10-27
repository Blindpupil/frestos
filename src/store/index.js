import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations } from 'vuexfire'
import '@/firebase'
import auth from '@/store/auth_module'
import user from '@/store/user_module'
import restos from '@/store/resto_module'
import comments from '@/store/comment_module'
import errors from '@/store/alert_module'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    auth,
    user,
    restos,
    comments,
    errors
  },
  mutations: { ...firebaseMutations }
})
