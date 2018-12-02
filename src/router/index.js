import Vue from 'vue'
import VueRouter from 'vue-router'
import { isEmpty } from 'lodash-es'
import store from '@/store'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/dashboard/Welcome'
import Restaurants from '@/components/dashboard/restaurant/Restaurants'
import Meetings from '@/components/dashboard/meeting/Meetings'

Vue.use(VueRouter)

async function requireAuth(to, from, next) {
  try {
    await store.dispatch('session')
    if (isEmpty(store.getters.currentUser)) {
      next({ path: '/login', replace: true })
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
  }
}

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dashboard',
      component: () => import('@/components/dashboard/Dashboard'),
      beforeEnter: (to, from, next) => requireAuth(to, from, next),
      children: [
        {
          path: '/',
          component: Welcome
        },
        {
          path: 'restaurants',
          component: Restaurants
        },
        {
          path: 'meetings',
          component: Meetings
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

