// Handle operations to the Comments reference in Firebase
import firebase from 'firebase'
import { firebaseAction } from 'vuexfire'
import { commentsRef } from '@/firebase'

export default {
  state: {
    comments: [],
    comment: ''
  },
  getters: {
    comments: state => state.comments,
    comment: state => state.comment
  },
  actions: {
    setCommentsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('comments', ref)
    }),
    setCommentByIdRef: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('comment', ref)
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
      const commentId = comment['.key']
      let commentKey
      try {
        commentKey = commentId || await commentsRef.push().key

        // You have to remove the .key from the comment before pushing it
        // eslint-disable-next-line
        if (commentId) delete comment['.key']

        await commentsRef.child(commentKey).update(comment, (error) => {
          if (error) {
            console.error('writeCommentToFb action update fn error', error)
            commit('setError', error)
          }
        })

        // Every time a new comment object is added, its ID is added to the user who wrote it
        // and to the restaurant it's referring to (done in resto module)
        if (!commentId) {
          await dispatch('addCommentToUser', commentKey)
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
