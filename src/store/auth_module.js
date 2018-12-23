import { get } from 'lodash-es'
import { usersRef, auth, googleProvider } from '@/firebase'
import {
  SESSION,
  SIGN_UP,
  ADD_USER_TO_FB,
  LOGIN,
  LOGOUT,
  GOOGLE_AUTH,
  HANDLE_GOOGLE_RESPONSE
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
    async [SESSION]({ commit }) {
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
    async [GOOGLE_AUTH]({ commit, dispatch }) {
      try {
        await auth.signInWithRedirect(googleProvider)
        await dispatch(SESSION)
      } catch (err) {
        console.error(err)
        commit(SET_ERROR, { code: err.code, message: err.message })
      }
    },
    async [HANDLE_GOOGLE_RESPONSE]({ commit, dispatch }) {
      try {
        const result = await auth.getRedirectResult()
        const isNewUser = get(result, 'additionalUserInfo.isNewUser', false)
        // const token = result.credential.accessToken

        if (isNewUser) {
          await dispatch(ADD_USER_TO_FB,
            {
              ...result.additionalUserInfo.profile,
              uid: result.user.uid
            })
        }
      } catch (err) {
        console.error(HANDLE_GOOGLE_RESPONSE, err)
        commit(SET_ERROR, err)
      }
    },
    async [ADD_USER_TO_FB]({ commit }, profile = {}) {
      const { uid } = profile

      try {
        const fullProfile = Object.assign({}, profile)

        delete fullProfile.link
        delete fullProfile.uid

        await usersRef.child(uid).set(fullProfile)
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
