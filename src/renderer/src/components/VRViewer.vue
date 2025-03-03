<script setup>
import { defineProps, onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  image: String
})

let scene, camera, renderer, sphere
const container = ref(null)
let lon = 0,
  phi = 0,
  theta = 0
let isDragging = false,
  lastX

onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', onWindowResize)
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

function initThreeJS() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(0, 0, 0)

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  const texture = new THREE.TextureLoader().load(props.image)
  texture.mapping = THREE.EquirectangularReflectionMapping

  const sphereGeometry = new THREE.SphereGeometry(500, 60, 40)
  sphereGeometry.scale(-1, 1, 1)
  const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)

  animate()
}

function onMouseDown(event) {
  isDragging = true
  lastX = event.clientX
}

function onMouseMove(event) {
  if (!isDragging) return

  let deltaX = event.clientX - lastX

  lon -= deltaX * 0.2

  lastX = event.clientX
}

function onMouseUp() {
  isDragging = false
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)

  phi = THREE.MathUtils.degToRad(90)
  theta = THREE.MathUtils.degToRad(lon)

  camera.lookAt(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta))

  renderer.render(scene, camera)
}
</script>

<template>
  <div ref="container" style="width: 100%; height: 100vh"></div>
</template>

<style scoped></style>
