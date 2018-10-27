import firebase from 'firebase'

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
    async session({ commit }) {
      let user
      try {
        user = await userInSession()
        commit('setUser', user)
      } catch (err) {
        console.error(err)
        commit('setUser', {})
      }
    },
    async signup({ commit, dispatch }, inputs) {
      let result
      let mergedUser
      try {
        result = await firebase.auth().createUserWithEmailAndPassword(inputs.email, inputs.password)
        mergedUser = Object.assign(inputs, result.user)

        await dispatch('addUserToDb', mergedUser)

        await dispatch('session')
      } catch (err) {
        commit('setError', err)
      }
    },
    async login({ commit, dispatch }, { email, password }) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password)

        await dispatch('session')
      } catch (err) {
        commit('setError', err)
      }
    },
    async addUserToDb({ commit }, { uid, firstName, lastName, interests, email }) {
      try {
        await firebase.database().ref(`users/${uid}`).set({
          firstName,
          lastName,
          interests,
          email
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
    }
  }
}
