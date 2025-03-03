<script setup>
import { ref, computed, nextTick } from 'vue'
import VRViewer from './components/VRViewer.vue'
console.log(window.getAssetPath)
const images = [
  {
    name: '客廳地板',
    chooseImage: '/material/001_floor.png',
    items: [
      { name: '磚地', thumbnail: '', descPath: '', vrPath: '', imgPath: '' },
      { name: '木地', thumbnail: '', descPath: '', vrPath: '', imgPath: '' }
    ]
  },
  {
    name: '配套廚具',
    chooseImage: '/material/002_kitchen.png',
    items: [
      { name: 'sa', thumbnail: '', descPath: '', vrPath: '', imgPath: '' },
      { name: 'bo', thumbnail: '', descPath: '', vrPath: '', imgPath: '' }
    ]
  },
  {
    name: '衛浴設備',
    chooseImage: '/material/003_bathroom.png',
    items: [
      { name: 'full', thumbnail: '', descPath: '', vrPath: '', imgPath: '' },
      { name: 'single', thumbnail: '', descPath: '', vrPath: '', imgPath: '' }
    ]
  }
]
// const stickerSrc = ref(
//   window.assetPath
//     ? window.assetPath.getAssetPath('game', 'hydrogen_sticker-black.svg')
//     : '/game/hydrogen_sticker-black.svg'
// )
// **使用者選擇的場景**
const selectedScene = ref('客廳') // 預設顯示客廳
const changeScene = () => {
  if (selectedScene.value === '客廳') {
    selectedScene.value = '餐廳'
  } else {
    selectedScene.value = '客廳'
  }
  // selectedScene.value = '客廳' ? '餐廳' : '客廳'
}
// **使用者的選擇（初始值）**
const selectedOptions = ref({
  floor: '木地', // 預設值
  kitchen: 'Bo',
  bathroom: '自動馬桶'
})

const scenes = ['客廳', '餐廳']
const floors = ['木地', '磚地']
const kitchens = ['Bo', 'Sa']
const bathrooms = ['自動馬桶', '馬桶']

const generateImageMap = (isVR = false) => {
  const imageMap = {}

  scenes.forEach((scene) => {
    floors.forEach((floor) => {
      kitchens.forEach((kitchen) => {
        bathrooms.forEach((bathroom) => {
          const key = `${scene}_${floor}_${kitchen}_${bathroom}`
          const folder = scene === '客廳' ? 'living' : 'dining'
          const suffix = isVR ? '/vr' : ''

          // 計算對應的圖片編號
          const fileIndex = (() => {
            if (floor === '木地' && kitchen === 'Bo' && bathroom === '自動馬桶') return '0'
            if (floor === '磚地' && kitchen === 'Bo' && bathroom === '自動馬桶') return '1'
            if (floor === '磚地' && kitchen === 'Sa' && bathroom === '自動馬桶') return '2'
            if (floor === '木地' && kitchen === 'Sa' && bathroom === '自動馬桶') return '3'
            if (floor === '木地' && kitchen === 'Bo' && bathroom === '馬桶') return '7'
            if (floor === '磚地' && kitchen === 'Bo' && bathroom === '馬桶') return '6'
            if (floor === '磚地' && kitchen === 'Sa' && bathroom === '馬桶') return '5'
            if (floor === '木地' && kitchen === 'Sa' && bathroom === '馬桶') return '4'
            return 'default'
          })()

          // 生成圖片路徑
          imageMap[key] = window.assetPath
            ? window.assetPath.getAssetPath(folder, `${suffix}/${fileIndex}.png`)
            : `/${folder}${suffix}/${fileIndex}.png`
        })
      })
    })
  })

  return imageMap
}

// **生成圖片映射表**
const normalImageMap = generateImageMap(false) // 普通模式
const vrImageMap = generateImageMap(true) // VR 模式

console.log('普通模式圖片:', normalImageMap)
console.log('VR 模式圖片:', vrImageMap)

// **是否為 VR 模式**
const isVRMode = ref(false)
const navbarImage = ref('001')
// **計算當前應該顯示的圖片**
const currentImage = computed(() => {
  const key = `${selectedScene.value}_${selectedOptions.value.floor}_${selectedOptions.value.kitchen}_${selectedOptions.value.bathroom}`

  if (isVRMode.value) {
    return (
      vrImageMap[key] ||
      (selectedScene.value === '客廳'
        ? window.assetPath.getAssetPath('living', 'vr0.png')
        : window.assetPath.getAssetPath('dining', 'vr0.png'))
    )
  } else {
    return (
      normalImageMap[key] ||
      (selectedScene.value === '客廳'
        ? window.assetPath.getAssetPath('living', '0.png')
        : window.assetPath.getAssetPath('dining', '0.png'))
    )
  }
})

const changeImage = async (image) => {
  navbarImage.value = '' // 先設為空值，強制觸發 reactivity
  await nextTick() // 等待 DOM 更新
  navbarImage.value = image
  console.log('navbarImage 更新:', navbarImage.value)
}

// **切換 VR 模式**
const toggleVRMode = () => {
  isVRMode.value = !isVRMode.value
}
</script>
<template lang="pug">
div.container
  nav
    ul
      li(v-for="image in images" :key="image.name")
        a(:href="image.path") {{ image.name }}
  .currentimage__container
    img(:src="currentImage" alt="current image")
    .select__scene(@click="changeScene") {{selectedScene}}
</template>

<style lang="sass" scoped>
.container
  width: 1920px
  height: 1080px
  display: flex
  nav
    width: 300px
    height: 100%
    background-color: #9C8E69
    display: flex
    justify-content: center
    align-items: center
    ul
      list-style-type: none
      width: 100%
      padding: 0
      display: flex
      flex-direction: column
      margin: auto
      li
        padding: 10px
        a
          color: white
          text-decoration: none
          &:hover
            text-decoration: underline

.text-container
  position: relative
  display: flex
  align-items: center
  justify-content: center
  font-size: 24px
  font-weight: bold
  color: white
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5)
  padding: 10px 20px
  border-radius: 10px
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.1) 10%,  // 10% 處最淺
    rgba(0, 0, 0, 0.6) 50%,  // 50% 最深
    rgba(0, 0, 0, 0.1) 90%   // 90% 處最淺
  )
.arrow
  display: inline-block
  width: 0
  height: 0
  border-style: solid
  margin: 0 10px

  &.left
    border-width: 6px 10px 6px 0
    border-color: transparent white transparent transparent

  &.right
    border-width: 6px 0 6px 10px
    border-color: transparent transparent transparent white
.currentimage__container
  width: 100%
  height: 100%
  position: relative
  img
    width: 100%
    height: 100%
    object-fit: cover
.select__scene
  position: absolute
  top: 10%
  left: 50%
  transform: translate(-50%, -50%)
  width: 100px
  height: 50px
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center
  font-size: 48px
  color: white
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5)
  z-index: 1
  cursor: pointer
  transition: background-color 0.3s

  &:hover
    background-color: rgba(0, 0, 0, 0.7)
</style>
