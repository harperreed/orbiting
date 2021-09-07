export const state = () => ({
  list: []
})

export const mutations = {
  add(state, text) {
    state.list.push({
      text,
      favorite: false
    })
  },
  remove(state, { message }) {
    state.list.splice(state.list.indexOf(message), 1)
  },
  clear(state) {
    state.list = []
  }
}