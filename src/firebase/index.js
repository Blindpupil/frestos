import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import config from '@/firebase/.config'

const app = firebase.initializeApp(config)
const db = app.database()

// Create direct database references
const restosRef = db.ref('restaurants')
const usersRef = db.ref('users')
const commentsRef = db.ref('comments')

// Custom reference
function customRef(reference) {
  return db.ref(reference)
}

// Auth function
const auth = firebase.auth()

// Google auth provider
const googleProvider = new firebase.auth.GoogleAuthProvider()

export { restosRef, commentsRef, usersRef, customRef, googleProvider, auth }
