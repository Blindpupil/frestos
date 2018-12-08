// Handle operations to the Users reference in Firebase
import { firebaseAction } from 'vuexfire'
import { usersRef } from '@/firebase'
import {
  SET_USER_REF,
  ADD_RESTO_TO_USER,
  ADD_COMMENT_TO_USER
} from '@/store/types/action_types'
import { SET_ERROR } from '@/store/types/mutation_types'

export default {
  state: {
    userObj: '',
    userComments: []
  },
  getters: {
    userObj: state => state.userObj
  },
  actions: {
    [SET_USER_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('userObj', ref)
    }),
    async [ADD_RESTO_TO_USER]({ commit, getters }, restoKey) {
      const uid = getters.currentUser
      try {
        // add the restaurant to the user object
        await usersRef.child(`${uid}/restaurants`).push(restoKey)
      } catch (err) {
        console.error('addRestaurantToUser action error: ', err)
        commit(SET_ERROR, err)
      }
    },
    async [ADD_COMMENT_TO_USER]({ commit, getters }, commentKey) {
      const uid = getters.currentUser
      try {
        // add the comment to the user object
        await usersRef.child(`${uid}/comments`).push(commentKey)
      } catch (err) {
        console.error('addCommentToUser: ', err)
        commit(SET_ERROR, err)
      }
    }
  },
  mutations: {}
}
