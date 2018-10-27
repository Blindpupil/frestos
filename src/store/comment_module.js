// Handle operations to the Comments reference in Firebase
import firebase from 'firebase'

export default {
  state: {
    comments: []
  },
  getters: {
    comments: state => state.comments
  },
  actions: {
    async writeCommentToFb({ commit, dispatch }, comment) {
      const { commentId } = comment
      let commentKey
      try {
        commentKey = commentId || await firebase.database().ref().child('comments').push().key
        const updates = {}

        updates[`/comments/${commentKey}`] = comment

        await firebase.database().ref().update(updates, (error) => {
          if (error) {
            console.error('writeRestaurantToFb action update fn error', error)
            commit('setError', error)
          } else {
            commit('addComment', comment)
          }
        })

        // Every time a new comment object is added, its ID is added to the user who wrote it
        // and to the restaurant it's referring to
        if (!commentId) {
          dispatch('addCommentToUser', commentKey)
          dispatch('addCommentToRestaurant', commentKey)
        }
      } catch (err) {
        console.error('writeCommentToFb action error: ', err)
        commit('setError', err)
      }
      return commentKey
    }
  },
  mutations: {
    addComment(state, comment) {
      state.comments = [...state.comments, comment]
    }
  }
}
