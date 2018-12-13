import { isEmpty } from 'lodash-es'

export class Photo {
  constructor(data = {}) {
    if (!isEmpty(data)) {
      this[`photos/${data.targetKey}`] = {
        main: data.main,
        source: data.source,
        url: data.url
      }
    }
  }
}

export function createPhoto(data) {
  return Object.freeze(new Photo(data))
}

