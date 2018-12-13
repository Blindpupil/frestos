import { createPhoto } from '@/models/Photo'
import { restosRef } from '@/firebase'
import { findKey, isEmpty } from 'lodash-es'

export class Restaurant {
  constructor(data = {}) {
    if (data.comments) this[`comments/${data.comments.targetKey}`] = data.comments.commentId
    if (data.link) this.link = data.link
    if (data.location) this.location = data.location
    if (data.name) this.name = data.name

    const photos = createPhoto(data.photos)
    Object.assign(this, photos)

    if (data.rating) this.rating = data.rating
    if (data.users) this[`users/${data.users.targetKey}`] = data.users.userId
  }
}

export function createRestaurant(data, restoKey, currentUser) {
  const { comment, commentInfo } = data

  let comments
  // Only new comments affect the restaurant in firebase, else nothing
  if (commentInfo.isNew && commentInfo.hasContent) {
    comments = {
      targetKey: restosRef.child(`${restoKey}/comments`).push().key,
      commentId: comment['.key']
    }
  }

  // Handle photo
  let photos
  if (!isEmpty(data.newPhotoUrl)) {
    const userPhotoKey = findKey(data.photos, o => o.source === currentUser)
    const photoKey = userPhotoKey || restosRef.child(`${restoKey}/photos`).push().key
    const photo = userPhotoKey ? data.photos[userPhotoKey] : data.photos

    // If there's no newPhotoUrl there's nothing to do here, move on
    photos = {
      targetKey: photoKey,
      ...photo,
      url: data.newPhotoUrl
    }
  }

  // Handle user
  let users
  let restaurantUserKey
  let userIds = []

  if (data.users) {
    // when resto is new this is empty
    userIds = Object.values(data.users)
  }

  // Only if the user is adding a new resto should this operation affect the user field in resto
  const match = userIds.includes(currentUser)

  if (!match) {
    // If the restaurant doesn't have the user, we'll need to add it
    restaurantUserKey = restosRef.child(`${restoKey}/users`).push().key
    users = {
      targetKey: restaurantUserKey,
      userId: currentUser
    }
  }

  return Object.freeze(new Restaurant({
    ...data,
    comments,
    users,
    photos
  }))
}

// FB-READY RESTAURANT OBJECT EXAMPLE
// {
//   "comments/-LSzSCnsgFfVvOl2fGOx": "-LSzSCjcQBzWkeTjI0EC",
//   "link": "link.com",
//   "location": "Madrid",
//   "name": "San Botin",
//   "photos/-LSzSCnt8oR08EZMoqBG": {
//     "main": true,
//     "source": "GURrTaWlUXXUxkDpA1WNlm09Fnh2",
//     "url": "https://imagesvc.timeincapp.com/v3/mm/image"
//   },
//   "rating": "4",
//   "users/-LSzSCnt8oR08EZMoqBH": "GURrTa..."
// }
