import {
  difference,
  filter,
  flatten,
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

export const processPeople = ({ people, userObj }) => {
  // Return people's name, picture and status
  const peopleList = []

  // This sentUsers is an array of userKeys to which this user sent requests
  const sentUsers = map(userObj.sent_requests, o => o.to)

  people.forEach((o) => {
    if (o['.key'] === userObj['.key']) return

    // If the currentUser sent a request to this person, set status as pending
    const status = sentUsers.includes(o['.key'])
      ? 'pending'
      : false

    peopleList.push({
      userKey: o['.key'],
      name: o.name,
      picture: o.picture,
      status
    })
  })
  return peopleList
}
