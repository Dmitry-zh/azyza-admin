import config from '~/config'
import { fetchImgPattern } from '~/constants/urlPatterns'

export default function getImageURL (filename) {
  let imagePattern = '/assets/placeholder.png'
  if (filename) {
    imagePattern = fetchImgPattern.replace('{filename}', filename)
  }

  return `${config.api.backendURL}${imagePattern}`
}
