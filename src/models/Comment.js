export class Comment {
  constructor({ content = '', restaurant = '', uid = '' } = {}) {
    this.content = content
    this.restaurant = restaurant
    this.uid = uid
  }
}

export function createComment(data) {
  return Object.freeze(new Comment(data))
}
