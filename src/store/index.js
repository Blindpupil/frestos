import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import '@/firebase'
import auth from '@/store/auth_module'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    auth
  },
  state: {
    restaurants: [], // Will be bound as an array
    user: null // Will be bound as an object
  },
  getters: {
    restaurants: state => state.restaurants
  },
  actions: {
    setRestosRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restaurants', ref)
    }),
    setUserRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('user', ref)
    })
  },
  mutations: { ...firebaseMutations }
})
