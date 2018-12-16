// Handle operations to the Comments reference in Firebase
import { firebaseAction } from 'vuexfire'
import { commentsRef } from '@/firebase'
import {
  SET_COMMENTS_REF,
  WRITE_COMMENT_TO_FB,
  ADD_COMMENT_TO_USER,
  DELETE_COMMENT,
  DELETE_COMMENT_FROM_RESTO
} from '@/store/types/action_types'
import { SET_ERROR } from '@/store/types/mutation_types'

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
    [SET_COMMENTS_REF]: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('comments', ref)
    }),
    /* eslint-disable */
    async [WRITE_COMMENT_TO_FB]({ commit, dispatch }, comment) {
      const commentId = comment['.key']
      const { isNew } = comment

      const newComment = {
        content: comment.content,
        restaurant: comment.restaurant,
        uid: comment.uid
      }

      let commentKey
      try {
        commentKey = commentId || await commentsRef.push().key

        await commentsRef.child(commentKey).update(newComment)

        // Every time a new comment object is added, its ID is added to the user who wrote it
        // and to the restaurant it's referring to but thats already handled in resto_module
        if (isNew) {
          await dispatch(ADD_COMMENT_TO_USER, commentKey)
        }
      } catch (err) {
        console.error('writeCommentToFb action error: ', err)
        commit(SET_ERROR, err)
      }
      return commentKey
    },
    async [DELETE_COMMENT]({ commit, dispatch }, { restoKey, commentKey }) {
      try {
        await commentsRef.child(commentKey).remove()
        await dispatch(DELETE_COMMENT_FROM_RESTO, { restoKey, commentKey })
      } catch (err) {
        console.error(DELETE_COMMENT, err)
        commit(SET_ERROR, err)
      }
    }
  },
  mutations: {}
}
