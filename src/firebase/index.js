/* eslint-disable */
import Firebase from 'firebase'
import config from './config'

const app = Firebase.initializeApp(config)
const db = app.database()

// create database references
const restosRef = db.ref('restaurants')

export { restosRef }
