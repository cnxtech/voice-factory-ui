<template lang="pug">
  .scene-manager(v-on:keyup.enter="handleKeys")
    img.s-0.bg-image.row(:class="scene0" src="/assets/images/high_res/big_colored.jpg" ref="s0")
    img.s-1.bg-image.row(:class="scene1" src="/assets/images/high_res/row1_colored.jpg" ref="s1")
    img.s-2.bg-image.col(:class="scene2" src="/assets/images/high_res/col1_colored.jpg" ref="s2")
    img.s-3.bg-image.row(:class="scene3" src="/assets/images/high_res/row2_colored.jpg" ref="s3")
    img.s-4.bg-image.col(:class="scene4" src="/assets/images/high_res/col2_colored.jpg" ref="s4")
    img.s-5.bg-image.row(:class="scene5" src="/assets/images/high_res/row3_colored.jpg" ref="s5")
    audio(ref="background" src="/assets/audio/background.mp3" loop preload="auto")
    audio(ref="vo" :src="currentVo" preload="auto")
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Scenes',

  data() {
    return {
      sequencer: false
    }
  },

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

    currentVo() {
      return '/assets/audio/' + this.currentScene + '.mp3'
    },

    scene0() {
      let classes = ''
      if (this.currentScene === 0) {
        classes = 'show'
      } else if (this.currentScene === 1) {
        classes = 'show animate-zoom-in'
      } else if (this.currentScene === 7) {
        classes = 'show animate-zoom-out bl'
      }
      return classes
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

  mounted() {
    this.$refs.vo.addEventListener('ended', this.playerEnd)
  },

  methods: {
    ...mapActions({
      setCurrentScene: 'setSceneNumber',
      setVoActive: 'setVoActive'
    }),

    handleKeys(e) {
      if(/^([0-7])$/.test(e.key)) {
        this.setCurrentScene(parseInt(e.key))
      }
    },

    playBackgroundAudio() {
      this.$refs.background.currentTime = 0
      this.$refs.background.play()
    },

    playVoAudio() {
      this.$refs.vo.currentTime = 0
      this.$refs.vo.play()
      this.setVoActive(true)
    },

    playerEnd() {
      this.setVoActive(false)
    },

    stopBackgroundAudio() {
      this.$refs.background.pause()
    },

    stopVoAudio() {
      this.$refs.vo.pause()
    },

    startAutomation() {
      this.sequencer = setInterval(() => {
        this.setCurrentScene(this.currentScene + 1)
        if (this.currentScene === 6) {
          clearInterval(this.sequencer)
        }
      }, 5000)
    }
  },

  watch: {
    currentScene() {
      if (this.currentScene === 0) {
        this.stopBackgroundAudio()
      } else if (this.currentScene === 1) {
        this.playBackgroundAudio()
        this.startAutomation()
      }
      setTimeout(this.playVoAudio, 2000)
    }
  }
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
    will-change: transform
    display: none
    opacity: 1
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
