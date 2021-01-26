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

  postEntity ({ commit }, payload) {
    const { reqBody, endpoint, headers } = payload

    return client.post(endpoint, reqBody, headers)
  }
}
