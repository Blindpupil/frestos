import firebase from 'firebase'

export default {
  state: {
    comments: [],
    userComments: []
  },
  getters: {
    comments: state => state.comments,
    userComments: state => state.userComments
  },
  actions: {
    async writeCommentToFb({ commit }, comment) {
      try {
        const commentKey = await firebase.database().ref().child('comments').push().key
        const updates = {}

        updates[`/comments/${commentKey}`] = comment

        await firebase.database().ref().update(updates, (error) => {
          if (error) {
            console.error('writeRestaurantToFb action update fn error', error)
            commit('setError', error)
          } else {
            commit('writeComment', comment)
          }
        })
      } catch (err) {
        console.error('writeCommentToFb action error: ', err)
        commit('setError', err)
      }
    }
  },
  mutations: {
    writeComment(state, comment) {
      state.comments = [...state.comments, comment]
      state.userComments = [...state.userComments, comment]
    },
    setError(state, err) {
      state.error = err
    }
  }
}
