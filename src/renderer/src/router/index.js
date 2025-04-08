import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  onBeforeRouteLeave
} from 'vue-router'
const routes = [
  { path: '/', name: 'Home', component: () => import('@renderer/views/Home.vue') },
  {
    path: '/second-room',
    name: 'SecondRoom',
    component: () => import('@renderer/views/SecondRoom.vue')
  }
]

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes
})

export default router
