import { createComment } from '@/models/Comment'
import { createRestaurant } from '@/models/Restaurant'

export class User {
  constructor({
    comments = null,
    email = '',
    firstName = '',
    interests = [],
    lastName = '',
    restaurants = null
  } = {}) {
    this.comments = comments
    this.email = email
    this.firstName = firstName
    this.interests = interests
    this.lastName = lastName
    this.restaurants = restaurants
  }
}

export function createUser(data) {
  const comments = createComment(data.comments)
  const restaurants = createRestaurant(data.restaurants)

  return Object.freeze(new User({ ...data, comments, restaurants }))
}
