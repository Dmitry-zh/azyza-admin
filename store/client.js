import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:5555/api'
})

client.interceptors.request.use((config) => {
  config.headers.authorization = 'lalka'

  return config
})

// export const state = () => ({
//   list: [],
//   readingNews: null
// })
//
// export const mutations = {
//   setNews (state, news) {
//     state.list = news
//   },
//   setReadingNews (state, news) {
//     state.readingNews = news
//   }
// }

export const actions = {
  fetchList ({ commit }, payload) {
    const { params, endpoint } = payload

    return client.get(endpoint, { params })
  },
  fetchOne ({ commit }, payload) {
    const { id, endpoint } = payload
    const fullPath = `${endpoint}/${id}`

    return client.get(fullPath)
  },
  createEntity ({ commit }, payload) {
    const { reqBody, endpoint, headers } = payload

    return client.post(endpoint, reqBody, headers)
  },
  updateEntity ({ commit }, payload) {
    const { reqBody, endpoint, headers } = payload

    return client.put(endpoint, reqBody, headers)
  }
}
