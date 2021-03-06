// Handle operations to the Restaurants reference in Firebase
import { firebaseAction } from 'vuexfire'
import { isEmpty } from 'lodash-es'
import {
  commentsRef,
  usersRef,
  restosRef
} from '@/firebase'
import {
  processRestaurantsToCards,
  processUsersRestaurants,
  processUsersRecommended
} from '@/store/utils'
import { createRestaurant } from '@/models/Restaurant'
import {
  ADD_COMMENT_TO_RESTO,
  ADD_RESTO_TO_USER,
  ADD_USER_TO_RESTO,
  DELETE_COMMENT_FROM_RESTO,
  GET_RESTOS_CARDS,
  SET_COMMENTS_REF,
  SET_RESTOS_REF,
  SET_RESTO_COMMENTS_REF,
  SET_RESTO_USERS_REF,
  SET_USER_REF,
  WRITE_COMMENT_TO_FB,
  WRITE_RESTO_TO_FB
} from '@/store/types/action_types'
import { SET_ERROR } from '@/store/types/mutation_types'

export default {
  state: {
    restaurants: [],
    userRestaurantCards: [],
    restoComments: [],
    restoUsers: []
  },
  getters: {
    restaurants: state => state.restaurants,
    restoComments: state => state.restoComments,
    restoUsers: state => state.restoUsers,
    userRestaurants: (state, getters) => {
      const { userObj } = getters
      const { restaurants } = state

      return processUsersRestaurants(userObj, restaurants)
    },
    userRecommended: (state, getters) => {
      const { userObj } = getters
      const { restaurants } = state

      return processUsersRecommended(userObj, restaurants)
    },
    userRestaurantCards: (state, getters, rootState) => {
      const { userRestaurants } = getters
      const { comments } = rootState.comments

      return processRestaurantsToCards(userRestaurants, comments)
    },
    userRecommendedCards: (state, getters, rootState) => {
      const { userRecommended } = getters
      const { comments } = rootState.comments

      return processRestaurantsToCards(userRecommended, comments)
    }
  },
  actions: {
    [SET_RESTOS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restaurants', ref)
    }),
    [SET_RESTO_COMMENTS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restoComments', ref)
    }),
    [SET_RESTO_USERS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restoUsers', ref)
    }),
    async [WRITE_RESTO_TO_FB]({ dispatch, getters, commit }, inputs) {
      const { currentUser } = getters
      const { comment } = inputs

      try {
        const restoKey = inputs['.key'] || await restosRef.push().key

        // Handle comment (helper object)
        const commentInfo = {
          isNew: !comment['.key'],
          hasContent: !isEmpty(comment.content),
          // also adding the restaraunt key for the case when it's a new one
          restaurant: restoKey
        }

        let commentId
        if (commentInfo.hasContent) {
          commentId = comment['.key'] || await commentsRef.push().key
        }

        comment['.key'] = commentId

        const data = {
          ...inputs,
          comment,
          commentInfo
        }

        const updates = await createRestaurant({ data, restoKey, currentUser })

        // Dispatch operations affecting firebase entries different than restaurant.
        // If restaurant is new, add it to user
        if (!inputs['.key']) await dispatch(ADD_RESTO_TO_USER, restoKey)

        // Write comment, if there's any content
        if (commentInfo.hasContent) {
          await dispatch(WRITE_COMMENT_TO_FB, Object.assign(comment, commentInfo))
        }

        // Finally, perform the update restaurant operation
        await restosRef.child(restoKey).update(updates)
      } catch (err) {
        console.error('writeRestaurantToFb: ', err)
        commit(SET_ERROR, err)
      }
    },
    async [ADD_COMMENT_TO_RESTO]({ commit }, commentId, restoId) {
      try {
        // add the comment to the restaurant object
        await restosRef.child(`${restoId}/comments`).push(commentId)
      } catch (err) {
        console.error('addCommentToUser: ', err)
        commit(SET_ERROR, err)
      }
    },
    async [ADD_USER_TO_RESTO]({ getters, commit }, { restoKey, targetKey }) {
      // This is a secondary operation to adding the restaurant to the user
      const { currentUser } = getters
      try {
        // Add user ID to resto object
        await restosRef.child(`${restoKey}/users/${targetKey}`).set(currentUser)
      } catch (err) {
        console.error(ADD_USER_TO_RESTO, err)
        commit(SET_ERROR, err)
      }
    },
    async [DELETE_COMMENT_FROM_RESTO]({ commit, dispatch, getters }, { restoKey, commentKey }) {
      const { currentUser } = getters
      try {
        // Remove the user from the restaurant
        await dispatch(SET_RESTO_USERS_REF, restosRef.child(`${restoKey}/users`))

        const userList = getters.restoUsers
        const userKeyInResto = userList.find(o => o['.value'] === currentUser)['.key']

        await restosRef.child(`${restoKey}/users/${userKeyInResto}`).remove()

        // Remove the user comment from the restaurant
        await dispatch(SET_RESTO_COMMENTS_REF, restosRef.child(`${restoKey}/comments`))

        const commentList = getters.restoComments
        const commentKeyInResto = commentList.find(o => o['.value'] === commentKey)['.key']

        await restosRef.child(`${restoKey}/comments/${commentKeyInResto}`).remove()
      } catch (err) {
        console.error(DELETE_COMMENT_FROM_RESTO, err)
        commit(SET_ERROR, err)
      }
    },
    async [GET_RESTOS_CARDS]({ commit, getters, dispatch }) {
      const { currentUser } = getters
      try {
        await dispatch(SET_USER_REF, usersRef.child(currentUser))
        await dispatch(SET_RESTOS_REF, restosRef)
        await dispatch(SET_COMMENTS_REF, commentsRef)
      } catch (err) {
        commit(SET_ERROR, err)
        console.error('getCardRestaurants action error: ', err)
      }
    }
  },
  mutations: {}
}
