// Handle operations to the Users reference in Firebase
import firebase from 'firebase'
import { firebaseAction } from 'vuexfire'

export default {
  state: {
    userRestaurants: [],
    userComments: []
  },
  getters: {
    userRestaurants: state => state.userRestaurants,
    userComments: state => state.userComments
  },
  actions: {
    setUserRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('user', ref)
    }),
    async addRestaurantToUser({ commit, getters }, restoKey) {
      const uid = getters.currentUser
      try {
        // add the restaurant to the user object
        await firebase.database().ref().child(`users/${uid}/restaurants`).push(restoKey)

        commit('addToUserRestaurants', restoKey)
      } catch (err) {
        console.error('addRestaurantToUser action error: ', err)
        commit('setError', err)
      }
    },
    async addCommentToUser({ commit, getters }, commentId) {
      const uid = getters.currentUser
      try {
        // add the comment to the user object
        await firebase.database().ref().child(`users/${uid}/comments`).push(commentId)

        commit('addToUserComments', commentId)
      } catch (err) {
        console.error('addCommentToUser: ', err)
        commit('setError', err)
      }
    }
  },
  mutations: {
    addToUserRestaurants(state, restaurant) {
      state.userRestaurants = [...state.userRestaurants, restaurant]
    },
    addToUserComments(state, comment) {
      state.userComments = [...state.userComments, comment]
    }
  }
}
