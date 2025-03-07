import { createRouter, createWebHistory, onBeforeRouteLeave } from 'vue-router'

// 切換頁面時不重置 sidebarImageId
onBeforeRouteLeave((to, from, next) => {
  next() // 允許導航
})
import Home from '../views/Home.vue'
import SecondRoom from '../views/SecondRoom.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/secondroom', name: 'SecondRoom', component: SecondRoom }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
