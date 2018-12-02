// Handle operations to the Users reference in Firebase
import firebase from 'firebase'
import { firebaseAction } from 'vuexfire'

export default {
  state: {
    userObj: '',
    userComments: []
  },
  getters: {
    userObj: state => state.userObj
  },
  actions: {
    setUserRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('userObj', ref)
    }),
    async addRestaurantToUser({ commit, getters }, restoKey) {
      const uid = getters.currentUser
      try {
        // add the restaurant to the user object
        await firebase.database().ref().child(`users/${uid}/restaurants`).push(restoKey)
      } catch (err) {
        console.error('addRestaurantToUser action error: ', err)
        commit('setError', err)
      }
    },
    async addCommentToUser({ commit, getters }, commentKey) {
      const uid = getters.currentUser
      try {
        // add the comment to the user object
        await firebase.database().ref().child(`users/${uid}/comments`).push(commentKey)
      } catch (err) {
        console.error('addCommentToUser: ', err)
        commit('setError', err)
      }
    }
  },
  mutations: {}
}
