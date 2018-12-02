import Firebase from 'firebase'
import config from './.config'

const app = Firebase.initializeApp(config)
const db = app.database()

// create direct database references
const restosRef = db.ref('restaurants')
const commentsRef = db.ref('comments')

// composed references
function refById(ref, id) {
  return db.ref(`${ref}/${id}`)
}

export { restosRef, commentsRef, refById }
