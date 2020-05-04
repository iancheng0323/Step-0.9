import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {firestorePlugin} from 'vuefire'
import VueRouter from 'vue-router'
import vueShortkey from 'vue-shortkey'
import {store} from './store/store.js'
import VueNativeNotification from 'vue-native-notification'


Vue.use(firestorePlugin)
Vue.use(VueRouter)
Vue.config.productionTip = false
// Vue.use(require('vue-shortkey'))
Vue.use(vueShortkey, { prevent: ['input', 'textarea'] })
Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})

//Router Setting
import Steps from './views/Steps.vue'
import Login from './views/Login.vue'
// import Mountains from './views/Mountains.vue'
import Numbers from './views/Numbers.vue'
import Settings from './views/Settings.vue'
import About from './views/About.vue'


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
  // {
    // path: '/mountains',
    // name: 'Mountains',
    // component: Mountains,
    // props:[],
  // },
  // {
  //   path: '/numbers',
  //   name: 'Numbers',
    // component: Numbers,
    // props:[],
  // },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    // props:[],
  },
  {
    path: '/numbers',
    name: 'Numbers',
    component: Numbers,
    // props:[],
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    // props:[],
  },
]

const router = new VueRouter({
  routes 
})

new Vue({
  vuetify,
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
