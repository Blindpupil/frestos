// Handle operations to the Comments reference in Firebase
import firebase from 'firebase'
import { firebaseAction } from 'vuexfire'

export default {
  state: {
    comments: []
  },
  getters: {
    comments: state => state.comments
  },
  actions: {
    setCommentsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('comments', ref)
    }),
    async getCommentById({ commit }, commentId) {
      try {
        const commentRef = await firebase.database().ref(`comments/${commentId}/content`)
        commentRef.on('value', (snap) => {
          commit('addComment', snap.val())
        })
      } catch (err) {
        console.error('getCommentsForResto action error: ', err)
        commit('setError', err)
      }
    },
    async writeCommentToFb({ commit, dispatch }, comment) {
      const { commentId } = comment
      let commentKey
      try {
        commentKey = commentId || await firebase.database().ref().child('comments').push().key
        const updates = {}

        updates[`/comments/${commentKey}`] = comment

        await firebase.database().ref().update(updates, (error) => {
          if (error) {
            console.error('writeCommentToFb action update fn error', error)
            commit('setError', error)
          } else {
            commit('addComment', comment)
          }
        })

        // Every time a new comment object is added, its ID is added to the user who wrote it
        // and to the restaurant it's referring to
        if (!commentId) {
          await dispatch('addCommentToUser', commentKey)
          await dispatch('addCommentToRestaurant', commentKey)
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
