import { createRouter, createWebHashHistory, onBeforeRouteLeave } from 'vue-router'

// 切換頁面時不重置 sidebarImageId
onBeforeRouteLeave((to, from, next) => {
  next() // 允許導航
})
// import Home from '../views/Home.vue'
// import SecondRoom from '../views/SecondRoom.vue'

const routes = [
  { path: '/', name: 'Home', component: () => import('@renderer/views/Home.vue') },
  {
    path: '/second-room',
    name: 'SecondRoom',
    component: () => import('@renderer/views/SecondRoom.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
