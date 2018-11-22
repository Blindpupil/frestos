import _ from 'lodash-es'

const processCardRestaurants = (restaurants, comments) => {
  const cardRestos = []
  restaurants.forEach((obj) => {
    // Get comments for that restaurant
    const commentObjs = _.filter(comments, o => o.restaurant === obj['.key'])

    // Get default photo
    const photoKey = _.findKey(obj.photos, o => o.default)
    const photo = obj.photos[photoKey]

    const card = {
      comments: commentObjs,
      ...obj,
      ...photo
    }

    cardRestos.push(card)
  })

  return cardRestos
}

export default processCardRestaurants
