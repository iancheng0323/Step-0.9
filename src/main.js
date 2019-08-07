import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {firestorePlugin} from 'vuefire'
import VueRouter from 'vue-router'

Vue.use(vuetify)
Vue.use(firestorePlugin)
Vue.use(VueRouter)
Vue.config.productionTip = false

import Steps from './views/Steps.vue'
import Login from './views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Steps',
    component: Steps
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // { path: '/bar', component: Bar }
]

const router = new VueRouter({
  routes 
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
