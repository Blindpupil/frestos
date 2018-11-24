// Handle operations to the Restaurants reference in Firebase
import firebase from 'firebase'
import { firebaseAction } from 'vuexfire'
import { restosRef, commentsRef } from '@/firebase'
import processCardRestaurants from '@/store/utils'

export default {
  state: {
    currentRestaurant: '',
    restaurants: [],
    cardRestaurants: []
  },
  getters: {
    currentRestaurant: state => state.currentRestaurant,
    restaurants: state => state.restaurants,
    cardRestaurants(state, getters, rootState) {
      const { restaurants } = rootState.restos
      const { comments } = rootState.comments

      return processCardRestaurants(restaurants, comments)
    }
  },
  actions: {
    setRestosRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restaurants', ref)
    }),
    async getCardRestaurants({ commit, dispatch }) {
      try {
        await dispatch('setRestosRef', restosRef)
        await dispatch('setCommentsRef', commentsRef)
      } catch (err) {
        console.error('getCardRestaurants action error: ', err)
        commit('setError', err)
      }
    },
    async writeRestaurantToFb({ commit, dispatch }, inputs) {
      const { uid } = inputs
      const { restoId } = inputs
      let restoKey
      try {
        // Use restaurant id or get a new key for the restaurant.
        restoKey = restoId || await firebase.database().ref().child('restaurants').push().key

        // TODO: Setting the current Restaurant to the store, probably shouldn't be done here
        commit('setCurrentRestaurant', restoKey)

        const updates = {}
        const restaurant = inputs

        delete restaurant.uid

        updates[`/restaurants/${restoKey}`] = restaurant

        // We will write the data in the restaurants list and the user restos list simultaneously.
        if (!restoId) {
          // if it's a new resto, add it to the list of the users restos
          dispatch('addRestaurantToUser', restoKey)
        }

        // in any case, update the restaurant info, or add it to Firebase
        await firebase.database().ref().update(updates, (error) => {
          if (error) {
            console.error('writeRestaurantToFb action update fn error: ', error)
            commit('setError', error)
          } else {
            commit('writeRestaurant', restoKey)
          }
        })

        // Finally add the current user to the restaurant object
        await firebase.database().ref().child(`restaurants/${restoKey}/uid`).push(uid)
      } catch (err) {
        console.error('writeRestaurantToFb action error: ', err)
        commit('setError', err)
      }
      return restoKey
    },
    async addCommentToRestaurant({ commit, getters }, commentId) {
      const restoId = getters.currentRestaurant
      try {
        // add the comment to the restaurant object
        await firebase.database().ref().child(`restaurants/${restoId}/comments`).push(commentId)
      } catch (err) {
        console.error('addCommentToUser: ', err)
        commit('setError', err)
      }
    }
  },
  mutations: {
    setCurrentRestaurant(state, restaurantId) {
      state.currentRestaurant = restaurantId
    },
    writeRestaurant(state, restaurant) {
      state.restaurants = [...state.restaurants, restaurant]
    }
  }
}
