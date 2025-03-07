<template lang="pug">
div.container
  router-view
</template>
<script setup></script>

<style lang="sass" scoped>
video
  position: fixed
  top: 0
  left: 0
  width: auto
  height: 100%
  object-fit: cover
  z-index: 999
  transition: opacity 1s ease-out


video.fadeOut
  opacity: 0
  pointer-events: none

.main-content
  opacity: 0
  transition: opacity 1s ease-in
  animation: fadeIn 1s ease-in forwards
  width: 1920px
  display: flex
@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1

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
  overflow: hidden
  .navbar__container
    display: inline-block
    max-width: 100%
    img
      width: 100%
      height: 100%
    .nav__item
      position: absolute
      width: 105px
      height: 32px
      border: 1px solid red
      cursor: pointer
    .nav__item1
      top: 424px
      left: 45px
    .nav__item2
      top: 485px
      left: 45px
    .nav__item3
      top: 550px
      left: 45px
    .nav__item4
      top: 612px
      left: 45px

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
  width: calc( 100% -  200px )
  height: 100%
  display: flex
  position: relative
  img
    width: auto
    height: 100%
    object-fit: cover
.select__scene
  position: absolute
  top: 10%
  left: 50%
  transform: translate(-50%, -50%)
  z-index: 1
  cursor: pointer
.scene__container
  width: 100%
  height: 90%
  position: relative
  margin: auto
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
    cursor: pointer
    top: 71%
    left: 44%

  .choose__item1,
  .choose__item2
    position: absolute
    width: 355px
    height: 355px
    top: 32%
    left: 25%
    cursor: pointer
    transition: background-color 0.3s

  .choose__item2
    left: 53.5%
  .close
    position: absolute
    top: 10%
    right: 5%
    width: 30px
    height: 30px
    color: white
    font-size: 24px
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer
    img
      width: 100%
      height: 100%

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
  cursor: pointer
  line-height: 30px
  font-size: 24px
  background-color: rgba(0, 0, 0, 0.3)
  z-index: 1
.vr__container
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  cursor: pointer
  opacity: 1
  transition: opacity 0.5s ease-in-out
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
    object-fit: cover
    object-position: center

.img__container
  width: 100%
  height: 100%
  position: relative


.bg__container
  position: absolute
  top: 0
  left: 0
  width: auto
  width: 100%
  height: 100vh
  overflow: hidden
  img
    width: 100%
    height: 100%
    object-position: right center
    object-fit: cover

.desc__close
  position: absolute
  top: 10%
  right: 5%
  width: 30px
  height: 30px
  color: white
  font-size: 24px
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  img
    width: 100%
    height: 100%

.option__image
  width: 200px
  height: auto
  position: absolute
  width: 365px
  height: 365px
  top: 303px
  left: 440px
  img
    width: 100%
    height: 100%
    object-fit: cover
    object-position: center
  &.pos_1
    top: 303px
    left: 440px
  &.pos_2
    top: 303px
    left: 928px
.allchoose__container
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  overflow: auto
  z-index: 3
  img
    width: 100%
    height: auto
</style>
