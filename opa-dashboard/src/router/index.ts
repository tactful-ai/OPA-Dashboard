import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RolesView from '../views/Roles/RolesView.vue'
import ResourcesView from '../views/Resources/ResourcesView.vue'
import PermissionsView from '../views/Permissions/PermissionsView.vue'
import EditorView from '../views/Editor/EditorView.vue'
import TagsView from '../views/Tags/TagsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/roles'
    // name: 'home',
    // component: HomeView
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
  },
  {
    path: '/editor',
    name: 'editor',
    component: EditorView
  },
  {
    path: '/tag',
    name: 'tag',
    component: TagsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
