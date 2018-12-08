// Handle operations to the Restaurants reference in Firebase

import { firebaseAction } from 'vuexfire'
import { isEmpty } from 'lodash-es'
import {
  restosRef,
  commentsRef,
  refById
} from '@/firebase'
import { processRestaurantsToCards, processUsersRestaurants } from '@/store/utils'
import { createRestaurant } from '@/models/Restaurant'
import {
  SET_RESTOS_REF,
  WRITE_RESTO_TO_FB,
  ADD_RESTO_TO_USER,
  WRITE_COMMENT_TO_FB,
  ADD_COMMENT_TO_RESTO,
  GET_RESTOS_CARDS,
  SET_USER_REF,
  SET_COMMENTS_REF
} from '@/store/types/action_types'
import { SET_ERROR } from '@/store/types/mutation_types'

export default {
  state: {
    restaurants: [],
    userRestaurantCards: []
  },
  getters: {
    restaurants: state => state.restaurants,
    userRestaurants: (state, getters) => {
      const { userObj } = getters
      const { restaurants } = state

      return processUsersRestaurants(userObj, restaurants)
    },
    userRestaurantCards: (state, getters, rootState) => {
      const { userRestaurants } = getters
      const { comments } = rootState.comments

      return processRestaurantsToCards(userRestaurants, comments)
    }
  },
  actions: {
    [SET_RESTOS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restaurants', ref)
    }),
    async [WRITE_RESTO_TO_FB]({ dispatch, getters, commit }, inputs) {
      const { currentUser } = getters
      const { comment } = inputs

      try {
        const restoKey = inputs['.key'] || await restosRef.push().key

        // Handle comment
        const commentInfo = {
          isNew: !comment['.key'],
          hasContent: !isEmpty(comment.content)
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

        const updates = await createRestaurant(data, restoKey, currentUser)

        // Dispatch operations affecting firebase entries different than restuarant
        // if resto is new, add restaurant to user
        if (!inputs['.key']) await dispatch(ADD_RESTO_TO_USER, restoKey)

        // edit comment, if there's any
        if (commentInfo.hasContent) {
          await dispatch(WRITE_COMMENT_TO_FB, Object.assign(comment, commentInfo))
        }

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
    async [GET_RESTOS_CARDS]({ commit, getters, dispatch }) {
      try {
        await dispatch(SET_USER_REF, refById('users', getters.currentUser))
        await dispatch(SET_RESTOS_REF, restosRef)
        await dispatch(SET_COMMENTS_REF, commentsRef)
      } catch (err) {
        console.error('getCardRestaurants action error: ', err)
        commit(SET_ERROR, err)
      }
    }
  },
  mutations: {}
}
