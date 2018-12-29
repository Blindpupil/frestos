// Handle operations to the Users reference in Firebase
import { firebaseAction } from 'vuexfire'
import { usersRef, customRef } from '@/firebase'
import {
  processPeople,
  processRequests,
  processFriends
} from '@/store/utils'
import {
  SET_USER_REF,
  ADD_RESTO_TO_USER,
  ADD_COMMENT_TO_USER,
  DELETE_COMMENT,
  DELETE_RESTO_FROM_USER,
  DELETE_COMMENT_FROM_USER,
  SET_USER_COMMENTS_REF,
  SET_USER_RESTOS_REF,
  SET_PEOPLE,
  SET_PEOPLE_LIST,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND,
  REMOVE_FRIEND_REQUEST
} from '@/store/types/action_types'
import { SET_ERROR } from '@/store/types/mutation_types'

export default {
  state: {
    userObj: '',
    userComments: [],
    userRestos: [],
    people: []
  },
  getters: {
    userObj: state => state.userObj,
    userComments: state => state.userComments,
    userRestos: state => state.userRestos,
    people: state => state.people,
    peopleList: state => processPeople({
      people: state.people,
      userObj: state.userObj
    }),
    sentRequests: (state, getters) => processRequests({
      peopleList: getters.peopleList,
      sentRequests: state.userObj.sent_requests
    }),
    incomingRequests: (state, getters) => processRequests({
      peopleList: getters.peopleList,
      incomingRequests: state.userObj.incoming_requests
    }),
    friendsList: (state, getters) => processFriends({
      peopleList: getters.peopleList,
      friends: state.userObj.friends
    })
  },
  actions: {
    [SET_PEOPLE]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('people', ref)
    }),
    [SET_USER_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('userObj', ref)
    }),
    [SET_USER_COMMENTS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('userComments', ref)
    }),
    [SET_USER_RESTOS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('userRestos', ref)
    }),
    async [SET_PEOPLE_LIST]({ commit, dispatch }) {
      try {
        await dispatch(SET_PEOPLE, usersRef)
      } catch (err) {
        console.error(SET_PEOPLE_LIST, err)
        commit(SET_ERROR, err)
      }
    },
    async [ADD_RESTO_TO_USER]({ commit, getters }, restoKey) {
      const { currentUser } = getters
      try {
        // add the restaurant to the user object
        await usersRef.child(`${currentUser}/restaurants`).push(restoKey)
      } catch (err) {
        console.error('addRestaurantToUser action error: ', err)
        commit(SET_ERROR, err)
      }
    },
    async [ADD_COMMENT_TO_USER]({ commit, getters }, commentKey) {
      const { currentUser } = getters
      try {
        // add the comment to the user object
        await usersRef.child(`${currentUser}/comments`).push(commentKey)
      } catch (err) {
        console.error('addCommentToUser: ', err)
        commit(SET_ERROR, err)
      }
    },
    async [DELETE_RESTO_FROM_USER]({ commit, dispatch, getters }, { restoKey, commentKey }) {
      const { currentUser } = getters
      try {
        // Delete the restaurant from the user
        await dispatch(SET_USER_RESTOS_REF, customRef(`users/${currentUser}/restaurants`))

        const restosList = getters.userRestos
        const restoKeyInUser = restosList.find(o => o['.value'] === restoKey)['.key']

        await usersRef.child(`${currentUser}/restaurants/${restoKeyInUser}`).remove()

        // Delete the restaurant's comment from the user's comments list
        await dispatch(DELETE_COMMENT_FROM_USER, { commentKey })

        // Handle the rest
        await dispatch(DELETE_COMMENT, { restoKey, commentKey })
      } catch (err) {
        console.error(DELETE_RESTO_FROM_USER, err)
        commit(SET_ERROR, err)
      }
    },
    async [DELETE_COMMENT_FROM_USER]({ commit, dispatch, getters }, { commentKey }) {
      const { currentUser } = getters
      try {
        await dispatch(SET_USER_COMMENTS_REF, usersRef.child(`${currentUser}/comments`))

        const commentList = getters.userComments
        const commentKeyInUser = commentList.find(o => o['.value'] === commentKey)['.key']

        await usersRef.child(`${currentUser}/comments/${commentKeyInUser}`).remove()
      } catch (err) {
        console.error(DELETE_COMMENT_FROM_USER, err)
        commit(SET_ERROR, err)
      }
    },
    async [SEND_FRIEND_REQUEST]({ commit, getters }, { userKey }) {
      const { currentUser } = getters
      try {
        // Share the same requestKey for the incoming and the sent lists
        // This makes it easier to handle later on
        const requestKey = await usersRef.child(`${userKey}/incoming_requests`).push().key

        // Send request to the target user
        await usersRef.child(`${userKey}/incoming_requests/${requestKey}`).set({
          from: currentUser,
          status: 'pending'
        })

        // Set request in the current user
        await usersRef.child(`${currentUser}/sent_requests/${requestKey}`).set({
          to: userKey,
          status: 'pending'
        })
      } catch (err) {
        console.error(SEND_FRIEND_REQUEST, err)
        commit(SET_ERROR, err)
      }
    },
    async [ACCEPT_FRIEND]({ commit, getters, dispatch }, { userKey, requestKey }) {
      const { currentUser } = getters
      try {
        // Share the same friendListKey in both users
        const friendListKey = await usersRef.child(`${currentUser}/friends`).push().key
        const timestamp = new Date()
        timestamp.toString()

        // Add friend to target
        await usersRef.child(`${userKey}/friends/${friendListKey}`).set({
          uid: currentUser,
          since: timestamp
        })

        // Add friend to currentUser
        await usersRef.child(`${currentUser}/friends/${friendListKey}`).set({
          uid: userKey,
          since: timestamp
        })

        // Now that it's added, we remove the friend request entry from firebase
        // TODO: this REMOVE_FRIEND_REQUEST is not working when adding
        await dispatch(REMOVE_FRIEND_REQUEST, { userKey, requestKey })
      } catch (err) {
        console.error(ACCEPT_FRIEND, err)
        commit(SET_ERROR, err)
      }
    },
    async [REMOVE_FRIEND_REQUEST]({ commit, getters }, { userKey, requestKey }) {
      const { currentUser } = getters
      try {
        // Remove from sent_requests list in target
        await usersRef.child(`${userKey}/sent_requests/${requestKey}`).remove()

        // Remove from incoming_requests list in currentUser
        await usersRef.child(`${currentUser}/incoming_requests/${requestKey}`).remove()
      } catch (err) {
        console.error(REMOVE_FRIEND_REQUEST, err)
        commit(SET_ERROR, err)
      }
    }
  },
  mutations: {}
}
