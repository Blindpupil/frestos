import {
  filter,
  values,
  flatten
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
