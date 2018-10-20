import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import '@/firebase'
import auth from '@/store/auth_module'
import restos from '@/store/resto_module'
import comments from '@/store/comment_module'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    auth,
    restos,
    comments
  },
  state: {
    user: null // Will be bound as an object,
  },
  actions: {
    setUserRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('user', ref)
    })
  },
  mutations: { ...firebaseMutations }
})
