import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Restaurants from '@/components/dashboard/Restaurants'
import Meetings from '@/components/dashboard/Meetings'
import Login from '@/components/Login'

Vue.use(VueRouter)

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
      name: 'Dashboard',
      component: () => import('@/components/dashboard/Dashboard'),
      children: [
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
