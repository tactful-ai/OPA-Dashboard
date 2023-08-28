import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RolesView from '../views/Roles/RolesView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import PermissionsView from '../views/PermissionsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/roles',
    name: 'roles',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    component: RolesView
  },
  {
    path: '/resources',
    name: 'resources',
    component: ResourcesView
  },
  {
    path: '/permissions',
    name: 'permissions',
    component: PermissionsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
