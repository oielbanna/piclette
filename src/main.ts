import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.scss' // global css

import Clipboard from 'v-clipboard'
Vue.use(Clipboard)
import Toasted from 'vue-toasted'
Vue.use(Toasted)
import VueKonva from 'vue-konva'
Vue.use(VueKonva)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
