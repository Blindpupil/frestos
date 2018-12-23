import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import config from '@/firebase/.config'

const app = firebase.initializeApp(config)
const db = app.database()

// Create direct database references
export const restosRef = db.ref('restaurants')
export const usersRef = db.ref('users')
export const commentsRef = db.ref('comments')

// Custom reference
export function customRef(reference) {
  return db.ref(reference)
}

// Auth function
export const auth = firebase.auth()

// Auth providers
export const googleProvider = new firebase.auth.GoogleAuthProvider()
export const facebookProvider = new firebase.auth.FacebookAuthProvider()
