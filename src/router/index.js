import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/components/dashboard/Dashboard')
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
