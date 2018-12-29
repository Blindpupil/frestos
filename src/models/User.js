import { get } from 'lodash-es'

export class User {
  constructor(data = {}) {
    if (data.newComment) this[`comments/${data.newComment.targetKey}`] = data.newComment.commentId
    if (data.email) this.email = data.email
    if (data.familyName) this.family_name = data.familyName
    if (data.givenName) this.given_name = data.givenName
    if (data.id) this.id = data.id
    if (data.interests) this.interests = data.interests
    if (data.locale) this.locale = data.locale
    if (data.name) this.name = data.name
    if (data.picture) this.picture = data.picture
    if (data.sent_requests) this.sent_requests = data.sent_requests // TBC
    if (data.incoming_requests) this.incoming_requests = data.incoming_requests // TBC
    if (data.friends) this.friends = data.friends // TBC
    if (data.newRestaurant) this[`restaurants/${data.newRestaurant.targetKey}`] = data.newRestaurant.restaurantId
  }
}

export function createUser(data) {
  const { email } = data
  const { id } = data
  const { interests } = data
  const { locale } = data
  const { name } = data

  const { newComment } = data
  const { newRestaurant } = data

  const givenName = data.given_name
    ? data.given_name
    : data.first_name

  const familyName = data.family_name
    ? data.given_name
    : data.last_name

  let picture
  if (get(data, 'picture.data.url')) {
    // Comes from Facebook
    picture = get(data, 'picture.data.url')
  } else if (data.picture) {
    // Comes from google
    // eslint-disable-next-line
    picture = data.picture
  } else {
    // No picture
    picture = null
  }

  return Object.freeze(new User({
    newComment,
    email,
    familyName,
    givenName,
    id,
    interests,
    locale,
    name,
    picture,
    newRestaurant
  }))
}

// FB-READY USER OBJECT EXAMPLE
// {
//   email: "cesar.martinez@globalgaming.com",
//   family_name: "Martinez",
//   given_name: "Cesar",
//   id: "113976752210995750859",
//   interests: ["1", "2"],
//   locale: "en",
//   name: "Cesar Martinez",
//   picture: "https://lh4.googleusercontent.com/-gBnq_iPibFY/...",
//   verified_email: true,
//   "comments/-LSzSCnsgFfVvOl2fGOx": "-LSzSCj...CommentId",
//   "restaurants/-LSzSCnsgFfVvOl2fGOx": "-LSzSCj...RestoId",
//   "sent_requests/-LSzSCnsgFfVvOl2fGOx": "-LSzSCj...requestId",
//   "incoming_requests/-LSzSCnsgFfVvOl2fGOx": "-LSzSCj...requestId"
// }
