import Vue from 'vue'
import VueRouter from 'vue-router'
import { get, isEmpty } from 'lodash-es'
import store from '@/store'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/dashboard/Welcome'
import Restaurants from '@/components/dashboard/restaurant/Restaurants'
import Meetings from '@/components/dashboard/meeting/Meetings'
import { SESSION } from '@/store/types/action_types'
import { SET_ERROR } from '@/store/types/mutation_types'

Vue.use(VueRouter)

async function requireAuth(to, from, next) {
  try {
    // Required to maintain the session
    await store.dispatch(SESSION)
    const currentUser = get(store, 'getters.currentUser', null)

    if (isEmpty(currentUser)) {
      next({ path: '/login', replace: true })
    } else {
      next()
    }
  } catch (err) {
    store.commit(SET_ERROR, err)
    console.error('error in requireAuth.', err)
  }
}
// When you log in through a Provider it takes you back to the login page.
// This is the function that redirects to the dashboard if login worked
async function checkForExistingSession(to, from, next) {
  try {
    // TODO: replace for a fullpage loader
    // (currently stays in a whitescreen for long)
    await store.dispatch(SESSION)
    const currentUser = get(store, 'getters.currentUser', null)

    if (!isEmpty(currentUser)) {
      next({ path: '/dashboard', replace: true })
    } else {
      next()
    }
  } catch (err) {
    store.commit(SET_ERROR, err)
    console.error('error in requireAuth.', err)
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
      component: Login,
      beforeEnter: (to, from, next) => checkForExistingSession(to, from, next)
    }
  ]
})

