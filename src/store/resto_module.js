// Handle operations to the Restaurants reference in Firebase
import firebase from 'firebase'
import { firebaseAction } from 'vuexfire'
import {
  values,
  findKey,
  isEmpty
} from 'lodash-es'
import {
  restosRef,
  commentsRef,
  refById
} from '@/firebase'
import { processRestaurantsToCards, processUsersRestaurants } from '@/store/utils'

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
    setRestosRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restaurants', ref)
    }),
    async writeRestaurantToFb({ commit, getters, dispatch }, inputs) {
      const { currentUser } = getters
      const restoKey = inputs['.key'] || await restosRef.push().key
      const { comment } = inputs
      const updates = {}

      try {
        updates.link = inputs.link
        updates.location = inputs.location
        updates.name = inputs.name

        // Hanlde comment
        // if it's a new comment, we need to send it with the resto key
        if (isEmpty(comment['.key'])) {
          comment.restaurant = restoKey
        }
        // Check if the user added some content in the comment
        if (!isEmpty(comment.content)) {
          const commentKey = await dispatch('writeCommentToFb', comment)

          // If the user didn't already have a comment in that resto, add it
          if (isEmpty(comment['.key'])) {
            const restoCommentKey = await restosRef.child(`${restoKey}/comments`).push().key
            updates[`comments/${restoCommentKey}`] = commentKey
          }
        }

        // Handle photo
        let newPhoto
        let userPhotoKey
        // Check if user submited a new photo
        if (!isEmpty(inputs.photoUrl)) {
          // See if the user already has a photo for that restaurant
          userPhotoKey = findKey(inputs.photos, o => o.source === currentUser)
          const oldPhoto = inputs.photos[userPhotoKey]
          if (userPhotoKey) {
            newPhoto = {
              ...oldPhoto,
              url: inputs.photoUrl
            }
          } else {
            // TODO: use it as default: needs to set all other pics as default: false
            newPhoto = {
              main: true,
              source: currentUser,
              url: inputs.photoUrl
            }
          }

          const newPhotoKey = userPhotoKey || await restosRef.child(`${restoKey}/photos`).push().key

          updates[`photos/${newPhotoKey}`] = newPhoto
        }

        // TODO: We'll deal with rating later
        updates.rating = inputs.rating

        // Handle user
        const userIds = values(inputs.users)
        const match = userIds.includes(currentUser)

        let restaurantUserKey
        if (!match) {
          // If the restaurant doesn't have the user, we'll need to add it
          restaurantUserKey = await restosRef.child(`${restoKey}/users`).push().key
          updates[`users/${restaurantUserKey}`] = currentUser
        }

        // If it's a new restaurant, add it to the user
        if (!inputs['.key']) await dispatch('addRestaurantToUser', restoKey)

        // Our new restaurant object is done
        await restosRef.child(restoKey).update(updates)
      } catch (err) {
        console.error('writeRestaurantToFb: ', err)
        commit('setError', err)
      }
      return restoKey
    },
    async addCommentToRestaurant({ commit }, commentId, restoId) {
      try {
        // add the comment to the restaurant object
        await firebase.database().ref().child(`restaurants/${restoId}/comments`).push(commentId)
      } catch (err) {
        console.error('addCommentToUser: ', err)
        commit('setError', err)
      }
    },
    async getRestaurantCards({ commit, getters, dispatch }) {
      try {
        await dispatch('setUserRef', refById('users', getters.currentUser))
        await dispatch('setRestosRef', restosRef)
        await dispatch('setCommentsRef', commentsRef)
      } catch (err) {
        console.error('getCardRestaurants action error: ', err)
        commit('setError', err)
      }
    }
  },
  mutations: {}
}
