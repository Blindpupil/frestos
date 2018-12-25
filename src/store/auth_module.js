import { get, isEmpty } from 'lodash-es'
import {
  usersRef,
  auth,
  googleProvider,
  facebookProvider
} from '@/firebase'
import { createUser } from '@/models/User'
import {
  SESSION,
  SIGN_UP,
  ADD_USER_TO_FB,
  LOGIN,
  LOGOUT,
  GOOGLE_AUTH,
  FACEBOOK_AUTH,
  HANDLE_PROVIDER_RESPONSE
} from '@/store/types/action_types'
import {
  SET_USER,
  SET_ERROR,
  SET_LOGOUT
} from '@/store/types/mutation_types'

const userInSession =  function () {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
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
    async [SESSION]({ getters, commit }) {
      const { currentUser } = getters
      if (!isEmpty(currentUser)) return

      let user
      try {
        user = await userInSession()
        commit(SET_USER, user)
      } catch (err) {
        commit(SET_ERROR, err)
        console.error('error in session.', err)
      }
    },
    async [SIGN_UP]({ commit, dispatch }, inputs) {
      let result
      let mergedUser
      try {
        result = await auth.createUserWithEmailAndPassword(inputs.email, inputs.password)
        mergedUser = Object.assign(inputs, result.user)

        await dispatch(ADD_USER_TO_FB, mergedUser)

        await dispatch(SESSION)
      } catch (err) {
        commit(SET_ERROR, err)
      }
    },
    async [LOGIN]({ commit, dispatch }, { email, password }) {
      try {
        await auth.signInWithEmailAndPassword(email, password)

        await dispatch(SESSION)
      } catch (err) {
        commit(SET_ERROR, err)
      }
    },
    async [GOOGLE_AUTH]({ commit }) {
      try {
        await auth.signInWithRedirect(googleProvider)
      } catch (err) {
        console.error(err)
        commit(SET_ERROR, { code: err.code, message: err.message })
      }
    },
    async [FACEBOOK_AUTH]({ commit }) {
      try {
        await auth.signInWithRedirect(facebookProvider)
      } catch (err) {
        console.error(err)
        commit(SET_ERROR, { code: err.code, message: err.message })
      }
    },
    async [HANDLE_PROVIDER_RESPONSE]({ commit, dispatch }) {
      try {
        const result = await auth.getRedirectResult()
        if (isEmpty(result.additionalUserInfo)) return

        // const token = result.credential.accessToken
        const profile = createUser(result.additionalUserInfo.profile)

        const isNewUser = get(result, 'additionalUserInfo.isNewUser', false)

        if (isNewUser) {
          await dispatch(ADD_USER_TO_FB, profile)
        }
      } catch (err) {
        console.error(HANDLE_PROVIDER_RESPONSE, err)
        commit(SET_ERROR, err)
      }
    },
    async [ADD_USER_TO_FB]({ commit, getters }, profile = {}) {
      const { currentUser } = getters

      try {
        await usersRef.child(currentUser).set(profile)
      } catch (err) {
        console.error('addUserToDb action error: ', err)
        commit(SET_ERROR, err)
      }
    },
    async [LOGOUT]({ commit }) {
      try {
        await auth.signOut()
        commit(SET_LOGOUT)
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
