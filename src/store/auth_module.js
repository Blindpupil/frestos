import firebase from 'firebase'

export default {
  state: {
    currentUser: '',
    error: {}
  },
  getters: {
    currentUser: state => state.currentUser,
    error: state => state.error
  },
  actions: {
    async signup({ commit, dispatch }, inputs) {
      let result
      let mergedUser
      try {
        result = await firebase.auth().createUserWithEmailAndPassword(inputs.email, inputs.password)
        mergedUser = Object.assign(inputs, result.user)

        await dispatch('addUserToDb', mergedUser)

        commit('setUser', result.user.uid)
      } catch (err) {
        commit('setError', err)
      }
    },
    async login({ commit }, { email, password }) {
      try {
        const { user } = await firebase.auth().signInWithEmailAndPassword(email, password)

        commit('setUser', user.uid)
      } catch (err) {
        commit('setError', err)
      }
    },
    async addUserToDb({ commit }, mergedUser) {
      try {
        await firebase.database().ref(`users/${mergedUser.uid}`).set({
          first_name: mergedUser.first_name,
          last_name: mergedUser.last_name,
          interests: mergedUser.interests,
          email: mergedUser.email
        })
      } catch (err) {
        console.error('addUserToDb action error: ', err)
        commit('setError', err)
      }
    },
    async logout({ commit }) {
      try {
        commit('setLogout', await firebase.auth().signOut())
      } catch (err) {
        commit('setError', err)
      }
    }
  },
  mutations: {
    setUser(state, user) {
      state.currentUser = user
    },
    setLogout(state) {
      state.currentUser = null
    },
    setError(state, err) {
      state.error = err
    }
  }
}
