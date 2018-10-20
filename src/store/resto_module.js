import firebase from 'firebase'
import { firebaseAction } from 'vuexfire'

export default {
  state: {
    restaurants: [],
    userRestaurants: []
  },
  getters: {
    restaurants: state => state.restaurants,
    userRestaurants: state => state.usersRestaurants
  },
  actions: {
    setRestosRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('restaurants', ref)
    }),
    async writeRestaurantToFb({ commit }, inputs) {
      const { uid } = inputs
      const { restoId } = inputs
      let restoKey
      try {
        // Use restaurant id or get a new key for the restaurant.
        restoKey = restoId || await firebase.database().ref().child('restaurants').push().key

        // We will write the data in the restaurants list and the user restos list simultaneously.
        const updates = {}
        const restaurant = inputs

        delete restaurant.uid

        updates[`/restaurants/${restoKey}`] = restaurant

        if (!restoId) {
          // if it's a new resto, add it to the list of the user restos
          await firebase.database().ref().child(`users/${uid}/restaurants`).push(restoKey)
        }

        // in any case, update the restaurant info, or add it to Firebase
        await firebase.database().ref().update(updates, (error) => {
          if (error) {
            console.error('writeRestaurantToFb action update fn error: ', error)
            commit('setError', error)
          } else {
            commit('writeRestaurant', inputs)
          }
        })
        // add the current user to the restaurant
        await firebase.database().ref().child(`restaurants/${restoKey}/uid`).push(uid)
      } catch (err) {
        console.error('writeRestaurantToFb action error: ', err)
        commit('setError', err)
      }
      return restoKey
    }
  },
  mutations: {
    writeRestaurant(state, restaurant) {
      state.restaurants = [...state.restaurants, restaurant]
      state.userRestaurants = [...state.userRestaurants, restaurant]
    },
    setError(state, err) {
      state.error = err
    }
  }
}
