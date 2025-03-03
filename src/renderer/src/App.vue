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

// **使用者的選擇（初始值）**
const selectedOptions = ref({
  floor: '木地', // 預設值
  kitchen: 'Bo',
  bathroom: '自動馬桶'
})

// **普通視圖的圖片對照表**
const normalImageMap = {
  客廳_木地_Bo_自動馬桶: window.assetPath
    ? window.assetPath.getAssetPath('living', '0.png')
    : '/living/0.png',
  客廳_磚地_Bo_自動馬桶: '/living/1.png',
  客廳_磚地_Sa_自動馬桶: '/living/2.png',
  客廳_木地_Sa_自動馬桶: '/living/3.png',
  客廳_木地_Bo_馬桶: '/living/7.png',
  客廳_磚地_Bo_馬桶: '/living/6.png',
  客廳_磚地_Sa_馬桶: '/living/5.png',
  客廳_木地_Sa_馬桶: '/living/4.png',

  餐廳_木地_Bo_自動馬桶: '/dining/0.png',
  餐廳_磚地_Bo_自動馬桶: '/dining/1.png',
  餐廳_磚地_Sa_自動馬桶: '/dining/2.png',
  餐廳_木地_Sa_自動馬桶: '/dining/3.png',
  餐廳_木地_Bo_馬桶: '/dining/7.png',
  餐廳_磚地_Bo_馬桶: '/dining/6.png',
  餐廳_磚地_Sa_馬桶: '/dining/5.png',
  餐廳_木地_Sa_馬桶: '/dining/4.png'
}

// **VR 視圖的圖片對照表**
const vrImageMap = {
  客廳_木地_Bo_自動馬桶: '/living/vr/0.png',
  客廳_磚地_Bo_自動馬桶: '/living/vr/1.png',
  客廳_磚地_Sa_自動馬桶: '/living/vr/2.png',
  客廳_木地_Sa_自動馬桶: '/living/vr/3.png',
  客廳_木地_Bo_馬桶: '/living/vr/7.png',
  客廳_磚地_Bo_馬桶: '/living/vr/6.png',
  客廳_磚地_Sa_馬桶: '/living/vr/5.png',
  客廳_木地_Sa_馬桶: '/living/vr/4.png',

  餐廳_木地_Bo_自動馬桶: '/dining/vr/0.png',
  餐廳_磚地_Bo_自動馬桶: '/dining/vr/1.png',
  餐廳_磚地_Sa_自動馬桶: '/dining/vr/2.png',
  餐廳_木地_Sa_自動馬桶: '/dining/vr/3.png',
  餐廳_木地_Bo_馬桶: '/dining/vr/7.png',
  餐廳_磚地_Bo_馬桶: '/dining/vr/6.png',
  餐廳_磚地_Sa_馬桶: '/dining/vr/5.png',
  餐廳_木地_Sa_馬桶: '/dining/vr/4.png'
}

// **是否為 VR 模式**
const isVRMode = ref(false)
const navbarImage = ref('001')
// **計算當前應該顯示的圖片**
const currentImage = computed(() => {
  const key = `${selectedScene.value}_${selectedOptions.value.floor}_${selectedOptions.value.kitchen}_${selectedOptions.value.bathroom}`

  if (isVRMode.value) {
    return (
      vrImageMap[key] || (selectedScene.value === '客廳' ? '/living/vr/0.jpg' : '/dining/vr/0.jpg')
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
  img
    width: 100%
    height: 100%
    object-fit: cover
</style>
