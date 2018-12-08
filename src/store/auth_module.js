import firebase from 'firebase'
import { usersRef } from '@/firebase'
import {
  SESSION,
  SIGN_UP,
  ADD_USER_TO_FB,
  LOGIN,
  LOGOUT
} from '@/store/types/action_types'
import {
  SET_USER,
  SET_ERROR,
  SET_LOGOUT
} from '@/store/types/mutation_types'

const userInSession =  function () {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user.uid)
      } else {
        reject(Error('No user authenticated'))
      }
    })
  })
}

export default {
  state: {
    currentUser: ''
  },
  getters: {
    currentUser: state => state.currentUser
  },
  actions: {
    async [SESSION]({ commit }) {
      let user
      try {
        user = await userInSession()
        commit(SET_USER, user)
      } catch (err) {
        console.error('error in session', err)
        commit(SET_ERROR, err)
      }
    },
    async [SIGN_UP]({ commit, dispatch }, inputs) {
      let result
      let mergedUser
      try {
        result = await firebase.auth().createUserWithEmailAndPassword(inputs.email, inputs.password)
        mergedUser = Object.assign(inputs, result.user)

        await dispatch(ADD_USER_TO_FB, mergedUser)

        await dispatch(SESSION)
      } catch (err) {
        commit(SET_ERROR, err)
      }
    },
    async [LOGIN]({ commit, dispatch }, { email, password }) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password)

        await dispatch(SESSION)
      } catch (err) {
        commit(SET_ERROR, err)
      }
    },
    async [ADD_USER_TO_FB]({ commit }, { uid, firstName, lastName, interests, email }) {
      try {
        await usersRef.child(uid).set({
          firstName,
          lastName,
          interests,
          email
        })
      } catch (err) {
        console.error('addUserToDb action error: ', err)
        commit(SET_ERROR, err)
      }
    },
    async [LOGOUT]({ commit }) {
      try {
        commit(SET_LOGOUT, await firebase.auth().signOut())
      } catch (err) {
        commit(SET_ERROR, err)
      }
    }
  },
  mutations: {
    [SET_USER](state, user) {
      state.currentUser = user
    },
    [SET_LOGOUT](state) {
      state.currentUser = null
    }
  }
}
