import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    paletteMode: false,
    dragging: false,
    card: false,
    loading: false,
    image: '',
    cardBg: '',
    points: []
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
