<template lang="pug">
div.container
  video(
      ref="introVideo"
      src="/video.mp4"
      autoplay
      playsinline
      controls
      @ended="handleVideoEnd"
      :class="{ fadeOut: !isVideoPlaying }"
    )
  div.main-content(v-if="!isVideoPlaying")
    nav
      ul
        li(v-for="image in images" :key="image.name" @click="chooseMaterial(image.id)" :class="{focus: currentMaterial && currentMaterial.id === image.id}") {{ image.name }}
    .currentimage__container
      .img__container(v-show="!isVRMode" :class="{ fadeOut: isFading, fadeIn: !isFading }")
        img(:src="currentImage" alt="current image" @load="handleImageLoad")
      .select__scene(@click="changeScene" :disabled="isInteractionDisabled")  {{selectedScene}}
      .vr__mode(@click="toggleVRMode" :disabled="isInteractionDisabled") {{isVRMode ? '3D' : 'VR'}}
      .vr__container(v-show="showVRViewer" :class="{ fadeOut: isVRFading && !isVRMode, fadeIn: isVRFading && isVRMode }")
        VRViewer(:image="currentImage")

      .material__container(v-if="currentMaterial")
        img(:src="currentMaterial.chooseImage" alt="current material")
        .choose__item1(@click="handleMaterialClick(0)")
        .choose__item2(@click="handleMaterialClick(1)")
        .description(@click="openDescription") 
        .desc__img(v-show="isDescriptionOpen")
          img(:src="materialDescImage" alt="desc image")
          .desc__close 
            .close(@click="isDescriptionOpen = false") {{"close"}}
        .close(@click="currentMaterial = null") {{"close"}}
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import VRViewer from './components/VRViewer.vue'
console.log(window.getAssetPath)
// **狀態：影片是否還在播放**
const isVideoPlaying = ref(true)
const isFading = ref(false)
const isVRFading = ref(false)
// **影片播放完畢，淡出並顯示首頁**
const handleVideoEnd = () => {
  isVideoPlaying.value = false
}

const currentMaterial = ref(null)
const selectedItem = ref(null)
const selectedItemIndex = ref({
  floor: 0,
  kitchen: 0,
  bathroom: 0
})
const isDescriptionOpen = ref(false)
const openDescription = () => {
  console.log('openDescription')
  isDescriptionOpen.value = true
}
const chooseMaterial = (id) => {
  currentMaterial.value = images.value.find((image) => image.id === id)
  console.log('ccc', currentMaterial.value)
  selectedItem.value = null // 切換時重置已選擇的選項
}
const chooseItem = (item) => {
  selectedItem.value = item.name
  selectedOptions.value[currentMaterial.value.name] = item.name
}

const images = ref([
  {
    type: 'floor',
    id: '001',
    name: '客廳地板',
    // chooseImage: '/material/001_floor.png',
    chooseImage: window.assetPath
      ? window.assetPath.getAssetPath('material', '001_floor.png')
      : '/material/001_floor.png',
    items: [
      {
        name: '木地',
        imgPath: window.assetPath
          ? window.assetPath.getAssetPath('material', '001_oak.png')
          : '/material/001_oak.png'
      },
      {
        name: '磚地',
        imgPath: window.assetPath
          ? window.assetPath.getAssetPath('material', '001_marble.png')
          : '/material/001_marble.png'
      }
    ]
  },
  {
    type: 'kitchen',
    id: '002',
    name: '配套廚具',
    // chooseImage: '/material/002_kitchen.png',
    chooseImage: window.assetPath
      ? window.assetPath.getAssetPath('material', '002_kitchen.png')
      : '/material/002_kitchen.png',
    items: [
      {
        name: 'Bo',
        imgPath: window.assetPath
          ? window.assetPath.getAssetPath('material', '002_bo.png')
          : '/material/002_bo.png'
      },
      {
        name: 'Sa',
        imgPath: window.assetPath
          ? window.assetPath.getAssetPath('material', '002_sa.png')
          : '/material/002_sa.png'
      }
    ]
  },
  {
    type: 'bathroom',
    id: '003',
    name: '衛浴設備',
    // chooseImage: '/material/003_bathroom.png',
    chooseImage: window.assetPath
      ? window.assetPath.getAssetPath('material', '003_bathroom.png')
      : '/material/003_bathroom.png',
    items: [
      {
        name: '自動馬桶',
        imgPath: window.assetPath
          ? window.assetPath.getAssetPath('material', '003_full.png')
          : '/material/003_full.png'
      },
      {
        name: '馬桶',
        imgPath: window.assetPath
          ? window.assetPath.getAssetPath('material', '003_single.png')
          : '/material/003_single.png'
      }
    ]
  }
])
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
          const suffix = isVR ? 'vr' : ''
          const extension = isVR ? 'jpg' : 'png' // ✅ VR 圖片為 `.jpg`，普通圖片為 `.png`

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
            ? window.assetPath.getAssetPath(folder, `${suffix}${fileIndex}.${extension}`)
            : `/${folder}/${suffix}${fileIndex}.${extension}`
        })
      })
    })
  })

  return imageMap
}

// **動態生成圖片映射表**
const normalImageMap = generateImageMap(false) // ✅ 普通模式 (PNG)
const vrImageMap = generateImageMap(true) // ✅ VR 模式 (JPG)

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

// **切換 VR 模式**
const toggleVRMode = () => {
  isVRMode.value = !isVRMode.value
}

const materialDescImage = computed(() => {
  if (!currentMaterial.value) return ''
  const type = currentMaterial.value.type
  console.log('currentMaterial', currentMaterial.value.items, selectedItemIndex.value[type])
  return currentMaterial.value.items[selectedItemIndex.value[type]].imgPath
})
// 處理選項點擊
const handleMaterialClick = (itemIndex) => {
  if (!currentMaterial.value) return
  const type = currentMaterial.value.type

  // 更新當前類別的選擇 index
  selectedItemIndex.value[type] = itemIndex
  console.log('selectedItemIndex', selectedItemIndex.value)
  const item = currentMaterial.value.items[itemIndex]
  if (!item) return

  // 根據當前材質類型更新相應的選項
  if (currentMaterial.value.id === '001') {
    // 客廳地板
    selectedOptions.value.floor = item.name
  } else if (currentMaterial.value.id === '002') {
    // 配套廚具
    selectedOptions.value.kitchen = item.name
  } else if (currentMaterial.value.id === '003') {
    // 衛浴設備
    selectedOptions.value.bathroom = item.name
  }
  console.log('selectedOptions', selectedOptions.value)
  // 可選：更新已選擇的選項
  selectedItem.value = item.name
}

const isInteractionDisabled = ref(false)
watch(currentImage, () => {
  isInteractionDisabled.value = true
  isFading.value = true

  setTimeout(() => {}, 500)
})

const handleImageLoad = () => {
  // Add a small delay before starting the fade in
  setTimeout(() => {
    isInteractionDisabled.value = false
    isFading.value = false // Start fade in
  }, 500)
}

// const isVRFading = ref(false)
const showVRViewer = ref(false) // 控制 VRViewer 何時真正顯示

// **監聽 VR 模式切換**
watch(isVRMode, (newVal) => {
  const vrContainer = document.querySelector('.vr__container')

  if (vrContainer) {
    if (newVal) {
      // 显示 VR 容器
      showVRViewer.value = true
      // 先设置为不可见
      vrContainer.style.opacity = '0'

      // 延迟一点点再淡入
      setTimeout(() => {
        vrContainer.style.opacity = '1'
      }, 50)
    } else {
      // 淡出
      vrContainer.style.opacity = '0'

      // 淡出后隐藏
      setTimeout(() => {
        showVRViewer.value = false
      }, 500)
    }
  }

  isInteractionDisabled.value = true
  setTimeout(() => {
    isInteractionDisabled.value = false
  }, 500)
})
</script>

<style lang="sass" scoped>
video
  position: fixed
  top: 0
  left: 0
  width: auto
  height: 100%
  object-fit: cover
  z-index: 999 // 確保在最上層
  transition: opacity 1s ease-out

// 當 `isVideoPlaying` 為 false 時，影片淡出
video.fadeOut
  opacity: 0
  pointer-events: none // 讓 `video` 不會擋住下方內容

.main-content
  opacity: 0
  transition: opacity 1s ease-in
  animation: fadeIn 1s ease-in forwards  // 讓首頁淡入
  width: 1920px
  height: 1080px
  display: flex
@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1
// 圖片淡入淡出動畫
.img__container
  opacity: 1
  transition: opacity 0.5s ease-in-out

// **圖片淡出**
.fadeOut
  opacity: 0

// **圖片淡入**
.fadeIn
  opacity: 1

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
      margin: auto
      list-style-type: none
      width: 100%
      padding: 0
      display: flex
      flex-direction: column
      margin: auto
      color: white
      li
        padding: 15px
        margin: auto
        cursor: pointer
        font-size: 24px
        color: #ccc
        &:hover
          color: #7B6D4A
          transition: color 0.3s
        &.focus
          color: #7B6D4A
          transition: color 0.3s
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
.focus
  color: #7B6D4A
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
.material__container
  position: absolute
  top: 0
  left: 0
  z-index: 2
  width: 100%
  height: 100%
  img
    width: 100%
    height: 100%
    object-fit: cover
  .description
    position: absolute
    width: 200px
    height: 50px
    // border: red 1px solid
    top: 71%
    left: 44%
  .choose__item1,
  .choose__item2
    position: absolute
    width: 355px
    height: 355px
    top: 32%
    left: 25%
    // background-color: rgba(0, 0, 0, 0.5)
    cursor: pointer
    transition: background-color 0.3s

  .choose__item2
    left: 53.5%
  .close
    position: absolute
    top: 10%
    right: 5%
    width: 50px
    height: 50px
    background-color: rgba(0, 0, 0, 0.5)
    color: white
    font-size: 24px
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer
    transition: background-color 0.3s

    &:hover
      background-color: rgba(0, 0, 0, 0.7)
.vr__mode
  position: absolute
  top: 10%
  right: 10%
  transform: translate(50%, -50%)
  width: 80px
  height: 30px
  border-radius: 5px
  color: #fff
  text-align: center
  line-height: 30px
  font-size: 24px
  // border: 1px solid white
  background-color: rgba(0, 0, 0, 0.3)
  z-index: 1
.vr__container
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  cursor: pointer
  opacity: 1 // 添加初始透明度
  transition: opacity 0.5s ease-in-out // 添加与img__container相同的过渡
.desc__img
  position: absolute
  top: 0
  left: 0
  z-index: 3
  width: 100%
  height: 100%
  img
    width: 100%
    height: 100%
    object-fit: contain
    object-position: center

.img__container
  width: 100%
  height: 100%
  position: relative
</style>
