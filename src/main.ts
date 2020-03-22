import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.scss' // global css

import Clipboard from 'v-clipboard'

import Toasted from 'vue-toasted'

import paper from 'paper'
import PaperVueify from 'paper-vueify'

Vue.use(PaperVueify, paper)
Vue.use(Clipboard)
Vue.use(Toasted)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
