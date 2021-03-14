import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Toasted from 'vue-toasted'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-loading-overlay/dist/vue-loading.css';
import '@/styles/style.scss'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)
Vue.use(require('vue-moment'));
Vue.use(Toasted, {
  containerClass: 'msg-toast-container',
  theme: "toasted-primary",
  position: "top-right",
  duration : 5000
})
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
