import {
  difference,
  filter,
  flatten,
  forEach,
  isEmpty,
  map,
  values
} from 'lodash-es'

export const processRestaurantsToCards = (restaurants, comments) => {
  const restosCard = []
  restaurants.forEach((obj) => {
    // Get comments for that restaurant
    const commentObjs = filter(comments, o => o.restaurant === obj['.key'])

    const card = {
      ...obj,
      comments: commentObjs
    }

    restosCard.push(card)
  })

  return restosCard
}

export const processUsersRestaurants = (user, restaurants) => {
  const userRestaurantsIds = values(user.restaurants)
  const userRestaurantsObjs = []
  userRestaurantsIds.forEach((id) => {
    const restaurant = filter(restaurants, o => o['.key'] === id)
    userRestaurantsObjs.push(restaurant)
  })
  return flatten(userRestaurantsObjs)
}

export const processUsersRecommended = (user, restaurants) => {
  // For now this only returns restos the user doesn't have
  const userRestosIds = values(user.restaurants)
  const restaurantIds = restaurants.map(o => o['.key'])
  const userRecommendedRestosIds = difference(restaurantIds, userRestosIds)

  const userRecommendedRestosObj = []

  userRecommendedRestosIds.forEach((id) => {
    const restaurant = restaurants.find(o => o['.key'] === id)
    userRecommendedRestosObj.push(restaurant)
  })

  return userRecommendedRestosObj
}

export const processPeople = ({ people = {}, userObj = {} } = {}) => {
  // Return people's name, picture and status
  const peopleList = []

  // This sentUsers is an array of userKeys to which this user sent requests
  const sents = map(userObj.sent_requests, o => o.to)
  // This incomings is an arrau of userKeys that have sent request to currentUser
  const incomings = map(userObj.incoming_requests, o => o.from)

  people.forEach((o) => {
    // Don't include currentUser in this list
    if (o['.key'] === userObj['.key']) return

    // If currentUser sent a request to this person,
    // or if he has an incoming request from this person,
    // then set status to pending
    let status
    if ((sents.includes(o['.key'])) || (incomings.includes(o['.key']))) {
      status = 'pending'
    } else {
      status = false
    }

    peopleList.push({
      userKey: o['.key'],
      name: o.name,
      picture: o.picture,
      status
    })
  })

  return peopleList
}

export const processRequests = ({
  peopleList = {},
  sentRequests = {},
  incomingRequests = {}
} = {}) => {
  let requests
  if (!isEmpty(sentRequests)) requests = sentRequests
  if (!isEmpty(incomingRequests)) requests = incomingRequests
  if (isEmpty(requests)) return null

  // The property 'to' is for sents, the property 'from' is for incomings
  // Only one gets processed each time
  // const requestUserIds = isEmpty(sentRequests) ? map(requests, 'from') : map(requests, 'to')
  const requestUserObjects = []

  forEach(requests, (value, key) =>
    requestUserObjects.push({
      requestKey: key,
      userKey: value.from || value.to
    }))

  const requestUsers = []
  requestUserObjects.forEach((requestObj) => {
    const match = peopleList.find(o => o.userKey === requestObj.userKey)
    requestUsers.push({ ...match, requestKey: requestObj.requestKey })
  })

  return requestUsers
}

export const processFriends = ({ peopleList = {}, friends = {} } = {}) => {
  if (isEmpty(friends)) return null
  const friendsObjects = []
  forEach(friends, (value, key) => {
    friendsObjects.push({
      friendListKey: key,
      friendKey: value.uid
    })
  })

  const friendsList = []
  friendsObjects.forEach((friendObj) => {
    const match = peopleList.find(o => o.userKey === friendObj.friendKey)
    friendsList.push({ ...match, friendListKey: friendObj.friendListKey })
  })

  return friendsList
}
