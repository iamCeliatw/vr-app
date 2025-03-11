<script setup>
import { defineProps, onMounted, onUnmounted, ref, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  image: String,
  active: {
    type: Boolean,
    default: true
  }
})

let scene, camera, renderer, sphere, sphereMaterial
const container = ref(null)

// 用來控制上下/左右視角
let lat = 0 // 垂直角度 (上下)
let lon = 0 // 水平角度 (左右)
let phi = 0,
  theta = 0

// 速度改成 X、Y 分開：水平 velocityX 與垂直 velocityY
let velocityX = 0
let velocityY = 0
const friction = 0.95 // 摩擦力（控制減速程度）

let isDragging = false
let lastX, lastY
let animationFrameId = null
let isInitialized = false

onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', onWindowResize)
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)

  // **滑鼠滾輪事件** → 主要新增的功能
  // 若要阻止瀏覽器預設的捲動行為，可將 { passive: false } 並在回呼內使用 event.preventDefault()
  document.addEventListener('wheel', onMouseWheel, { passive: false })
})

onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('wheel', onMouseWheel)
  // 清理资源
  if (renderer) {
    renderer.dispose()
  }
  if (sphere && sphere.geometry) {
    sphere.geometry.dispose()
  }
  if (sphereMaterial && sphereMaterial.map) {
    sphereMaterial.map.dispose()
    sphereMaterial.dispose()
  }
})

// 主要新增的縮放事件函式
function onMouseWheel(event) {
  // 如果你想阻止瀏覽器的捲動行為，可以取消註解這行：
  // event.preventDefault()

  // 調整 camera 的視野(FOV)，讓滾輪向上滾時拉近、向下滾時拉遠
  camera.fov += event.deltaY * 0.05

  // 限制 FOV 在合適範圍，避免過度變形
  camera.fov = THREE.MathUtils.clamp(camera.fov, 15, 100)
  camera.updateProjectionMatrix()

  // 若目前沒有運行動畫，需手動 render 以便立即更新視圖
  if (!animationFrameId) {
    render()
  }
}
// 監聽 image 變化，若有新圖就換貼圖
watch(
  () => props.image,
  (newImage) => {
    if (newImage && sphere && scene) {
      updateTexture(newImage)
    }
  }
)

// 監聽 active 變化，決定是否啟動動畫
watch(
  () => props.active,
  (isActive) => {
    if (isActive) {
      if (isInitialized) {
        startAnimation()
      }
    } else {
      stopAnimation()
    }
  }
)

function initThreeJS() {
  if (isInitialized) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  const light = new THREE.AmbientLight(0xffffff, 0.5) // 50% 環境光
  scene.add(light)

  // 創建一個初始貼圖（對應 props.image）
  const defaultTexture = new THREE.TextureLoader().load(props.image, () => {
    if (container.value) {
      container.value.classList.remove('loading')
    }
    render() // 確保至少渲染一次
  })
  defaultTexture.mapping = THREE.EquirectangularReflectionMapping

  // 建立球體
  const sphereGeometry = new THREE.SphereGeometry(500, 60, 40)
  sphereGeometry.scale(-1, 1, 1) // 讓貼圖在球體內側
  sphereMaterial = new THREE.MeshBasicMaterial({ map: defaultTexture })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)

  isInitialized = true

  // 若 active = true 就開始動畫
  if (props.active) {
    startAnimation()
  } else {
    // 即使不活躍也至少渲染一次，確保畫面正確
    render()
  }
}

function startAnimation() {
  if (!animationFrameId) {
    animate()
  }
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}
function getFolderName(imageUrl) {
  const parts = imageUrl.split('/')
  return parts.length > 1 ? parts[0] : ''
}

function getFileName(imageUrl) {
  const parts = imageUrl.split('/')
  return parts.length > 1 ? parts.slice(1).join('/') : imageUrl
}

// 換圖時使用
function updateTexture(imageUrl) {
  // 只有在组件可见时才更新纹理
  if (!props.active) return

  // 显示加载指示器或设置默认纹理
  if (container.value) {
    container.value.classList.add('loading')
  }
  console.log('imageurl', imageUrl)
  lon = props.image.includes('dining') ? -360 : 180
  lat = 0
  // 根據是否打包來確保正確的路徑
  const newImageUrl = window.assetPath
    ? window.assetPath.getAssetPath(getFolderName(imageUrl), getFileName(imageUrl))
    : `/${imageUrl}`

  console.log('載入圖片:', newImageUrl, getFolderName(imageUrl), getFileName(imageUrl))
  // 加载新纹理
  const textureLoader = new THREE.TextureLoader()
  textureLoader.load(
    newImageUrl,
    (texture) => {
      // 设置纹理映射方式
      texture.encoding = THREE.sRGBEncoding // 確保顏色正確
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.colorSpace = 'srgb' // 降低亮度

      // 更新球体材质的贴图
      if (sphereMaterial) {
        // 释放旧纹理
        if (sphereMaterial.map) {
          sphereMaterial.map.dispose()
        }
        // 应用新纹理
        sphereMaterial.map = texture
        sphereMaterial.needsUpdate = true
      }

      // 移除加载指示器
      if (container.value) {
        container.value.classList.remove('loading')
      }
    },
    undefined, // onProgress 回调
    (error) => {
      console.error('Error loading texture', error)
      if (container.value) {
        container.value.classList.remove('loading')
      }
    }
  )
}

// 滑鼠事件
function onMouseDown(event) {
  if (!props.active) return
  isDragging = true
  lastX = event.clientX
  lastY = event.clientY
}

function onMouseMove(event) {
  if (!isDragging || !props.active) return

  const deltaX = event.clientX - lastX
  const deltaY = event.clientY - lastY

  // 調低靈敏度 (原本是 0.2，可改成 0.1 或更低)
  const sensitivity = 0.1
  velocityX = deltaX * sensitivity
  velocityY = -deltaY * sensitivity

  lon -= velocityX
  lat -= velocityY
  lat = Math.max(-85, Math.min(85, lat))

  lastX = event.clientX
  lastY = event.clientY

  // 即使沒在動畫循環，也要立刻渲染看看
  if (!animationFrameId) {
    render()
  }
}

function onMouseUp() {
  isDragging = false
  applyInertia() // 啟動慣性緩衝
}

function applyInertia() {
  // 若速度很小，就直接歸零
  if (Math.abs(velocityX) < 0.01 && Math.abs(velocityY) < 0.01) {
    velocityX = 0
    velocityY = 0
    return
  }

  // 逐漸減速
  velocityX *= friction
  velocityY *= friction

  lon -= velocityX
  lat -= velocityY

  lat = Math.max(-85, Math.min(85, lat)) // 再度限制視角

  render()
  requestAnimationFrame(applyInertia)
}

function onWindowResize() {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 確保更新大小後立刻重繪
  if (!animationFrameId) {
    render()
  }
}

function render() {
  if (!scene || !camera || !renderer) return

  // phi = 90° - lat，theta = lon
  // lat 控制上下、lon 控制左右
  phi = THREE.MathUtils.degToRad(90 - lat)
  theta = THREE.MathUtils.degToRad(lon)

  // 根據 phi、theta 計算鏡頭要看的位置
  camera.lookAt(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta))

  renderer.render(scene, camera)
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)
  render()
}
</script>

<template>
  <div ref="container" class="vr-container" :class="{ active: active }">
    <!-- 可以添加加载指示器 -->
    <div class="loading-indicator" v-show="false">加载中...</div>
  </div>
</template>

<style scoped>
.vr-container {
  width: 100%;
  height: 100%;
  position: relative;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  overflow: hidden;
}

.vr-container.active {
  opacity: 1;
}

.vr-container.loading::after {
  content: 'Loading...';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  z-index: 1;
}
</style>
