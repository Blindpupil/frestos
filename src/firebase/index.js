import Firebase from 'firebase'
import config from '@/firebase/.config'

const app = Firebase.initializeApp(config)
const db = app.database()

// create direct database references
const restosRef = db.ref('restaurants')
const usersRef = db.ref('users')
const commentsRef = db.ref('comments')

// custom reference
function customRef(reference) {
  return db.ref(reference)
}

export { restosRef, commentsRef, usersRef, customRef }
