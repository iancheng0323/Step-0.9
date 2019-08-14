import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {firestorePlugin} from 'vuefire'
import VueRouter from 'vue-router'

Vue.use(vuetify)
Vue.use(firestorePlugin)
Vue.use(VueRouter)
Vue.config.productionTip = false




//Router Setting
import Steps from './views/Steps.vue'
import Login from './views/Login.vue'
import Mountains from './views/Mountains.vue'
import Numbers from './views/Numbers.vue'
import Routines from './views/Routines.vue'




const routes = [
  {
    path: '/',
    name: 'Steps',
    component: Steps,
    // props:[],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    // props:[],
  },
  {
    path: '/mountains',
    name: 'Mountains',
    component: Mountains,
    // props:[],
  },
  {
    path: '/numbers',
    name: 'Numbers',
    component: Numbers,
    // props:[],
  },
  {
    path: '/routines',
    name: 'Routines',
    component: Routines,
    // props:[],
  },
]

const router = new VueRouter({
  routes 
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
