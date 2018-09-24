import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    restaurants: [], // Will be bound as an array
    users: null // Will be bound as an object
  },
  getters: {
    restaurants: state => state.restaurants
  },
  actions: {
    setRestosRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restaurants', ref)
    })
  },
  mutations: { ...firebaseMutations }
})
