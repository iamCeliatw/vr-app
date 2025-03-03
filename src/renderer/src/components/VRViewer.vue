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
let lon = 0,
  phi = 0,
  theta = 0
let isDragging = false,
  lastX
let animationFrameId = null
let isInitialized = false

onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', onWindowResize)
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)

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

// 监听 image prop 的变化
watch(
  () => props.image,
  (newImage) => {
    if (newImage && sphere && scene) {
      updateTexture(newImage)
    }
  }
)

// 监听 active prop 的变化
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
function getFolderName(imageUrl) {
  const parts = imageUrl.split('/')
  return parts.length > 1 ? parts[0] : ''
}

function getFileName(imageUrl) {
  const parts = imageUrl.split('/')
  return parts.length > 1 ? parts.slice(1).join('/') : imageUrl
}

function updateTexture(imageUrl) {
  // 只有在组件可见时才更新纹理
  if (!props.active) return

  // 显示加载指示器或设置默认纹理
  if (container.value) {
    container.value.classList.add('loading')
  }
  console.log('imageurl', imageUrl)
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
      texture.mapping = THREE.EquirectangularReflectionMapping

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

function initThreeJS() {
  if (isInitialized) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  // 创建一个默认的纯色纹理，作为加载前的占位符
  const defaultTexture = new THREE.TextureLoader().load(props.image, () => {
    // 纹理加载完成后，移除加载指示器
    if (container.value) {
      container.value.classList.remove('loading')
    }
    render() // 确保至少渲染一次
  })
  defaultTexture.mapping = THREE.EquirectangularReflectionMapping

  const sphereGeometry = new THREE.SphereGeometry(500, 60, 40)
  sphereGeometry.scale(-1, 1, 1)
  sphereMaterial = new THREE.MeshBasicMaterial({ map: defaultTexture })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)

  isInitialized = true

  if (props.active) {
    startAnimation()
  } else {
    // 即使不活跃也至少渲染一次，确保内容可见
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

function onMouseDown(event) {
  if (!props.active) return
  isDragging = true
  lastX = event.clientX
}

function onMouseMove(event) {
  if (!isDragging || !props.active) return

  let deltaX = event.clientX - lastX

  lon -= deltaX * 0.2

  lastX = event.clientX

  // 确保即使未运行动画循环，也能看到移动效果
  if (!animationFrameId) {
    render()
  }
}

function onMouseUp() {
  isDragging = false
}

function onWindowResize() {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 确保即使未运行动画循环，在调整窗口大小后也能看到更新
  if (!animationFrameId) {
    render()
  }
}

function render() {
  if (!scene || !camera || !renderer) return

  phi = THREE.MathUtils.degToRad(90)
  theta = THREE.MathUtils.degToRad(lon)

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
  height: 100vh;
  position: relative;
  opacity: 0;
  transition: opacity 0.3s ease;
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
