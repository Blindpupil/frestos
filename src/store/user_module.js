// Handle operations to the Users reference in Firebase
import { firebaseAction } from 'vuexfire'
import { usersRef, customRef } from '@/firebase'
import {
  SET_USER_REF,
  ADD_RESTO_TO_USER,
  ADD_COMMENT_TO_USER,
  DELETE_COMMENT,
  DELETE_RESTO_FROM_USER,
  SET_USER_COMMENTS_REF,
  SET_USER_RESTOS_REF
} from '@/store/types/action_types'
import { SET_ERROR } from '@/store/types/mutation_types'

export default {
  state: {
    userObj: '',
    userComments: [],
    userRestos: []
  },
  getters: {
    userObj: state => state.userObj,
    userComments: state => state.userComments,
    userRestos: state => state.userRestos
  },
  actions: {
    [SET_USER_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('userObj', ref)
    }),
    [SET_USER_COMMENTS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('userComments', ref)
    }),
    [SET_USER_RESTOS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('userRestos', ref)
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
    },
    async [DELETE_RESTO_FROM_USER]({ commit, dispatch, getters }, { restoKey, commentKey }) {
      const uid = getters.currentUser
      try {
        // Delete the restaurant from the user
        await dispatch(SET_USER_RESTOS_REF, customRef(`users/${uid}/restaurants`))

        const restosList = getters.userRestos
        const restoKeyInUser = restosList.find(o => o['.value'] === restoKey)['.key']

        await usersRef.child(`${uid}/restaurants/${restoKeyInUser}`).remove()

        // Delete the restaurant's comment from the user's comments list
        await dispatch(SET_USER_COMMENTS_REF, customRef(`users/${uid}/comments`))

        const commentList = getters.userComments
        const commentKeyInUser = commentList.find(o => o['.value'] === commentKey)['.key']

        // Handle the rest
        await usersRef.child(`${uid}/comments/${commentKeyInUser}`).remove()
        await dispatch(DELETE_COMMENT, { restoKey, commentKey })
      } catch (err) {
        console.error(DELETE_RESTO_FROM_USER, err)
        commit(SET_ERROR, err)
      }
    }
  },
  mutations: {}
}
