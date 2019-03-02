<template lang="pug">
  .scene-manager(v-on:keyup.enter="handleKeys")
    img.s-0.bg-image.row(:class="scene0" src="/assets/images/big.jpg" ref="s0")
    img.s-1.bg-image.row(:class="scene1" src="/assets/images/row1.jpg" ref="s1")
    img.s-2.bg-image.col(:class="scene2" src="/assets/images/col1.jpg" ref="s2")
    img.s-3.bg-image.row(:class="scene3" src="/assets/images/row2.jpg" ref="s3")
    img.s-4.bg-image.col(:class="scene4" src="/assets/images/col2.jpg" ref="s4")
    img.s-5.bg-image.row(:class="scene5" src="/assets/images/row3.jpg" ref="s5")
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Scenes',

  created() {
    window.addEventListener('keydown', this.handleKeys)
  },

  destroyed() {
    window.removeEventListener('keydown', this.handleKeys)
  },

  computed: {
    ...mapGetters({
      currentScene: 'getSceneNumber'
    }),

    scene0() {
      let classes = ''
      if (this.currentScene === 0) {
        return 'show'
      } else if (this.currentScene === 1) {
        return 'show animate-zoom-in'
      } else if (this.currentScene === 7) {
        return 'show animate-zoom-out bl'
      }
    },

    scene1() {
      return this.currentScene === 2 ? 'show animate-right' : ''
    },

    scene2() {
      return this.currentScene === 3 ? 'show animate-down' : ''
    },

    scene3() {
      return this.currentScene === 4 ? 'show animate-left' : ''
    },

    scene4() {
      return this.currentScene === 5 ? 'show animate-down' : ''
    },

    scene5() {
      return this.currentScene === 6 ? 'show animate-right' : ''
    }
  },

  methods: {
    ...mapActions({
      setCurrentScene: 'setSceneNumber'
    }),

    handleKeys(e) {
      if(/^([0-7])$/.test(e.key)) {
        this.setCurrentScene(parseInt(e.key))
      }
    }
  },
}
</script>

<style lang="sass">
.scene-manager
  .bg-image
    position: fixed
    top: 0
    left: 0
    object-fit: cover
    object-position: top left
    transform-style: preserve-3d
    z-index: -1
    transition: transform 3s ease-in-out
    backface-visibility: hidden
    will-change: transition
    display: none
    &.row
      width: 300vw
      height: 100vh
    &.col
      width: 100vw
      height: 200vh
    &.s-3
      transform: translate3d(-200vw, 0, 0)
    &.show
      display: block
    &.s-0
      width: 100vw
      height: 100vh
      opacity: 0.3
      &.bl
        object-position: bottom right
</style>
