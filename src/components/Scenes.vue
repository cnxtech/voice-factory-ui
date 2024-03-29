<template lang="pug">
  .scene-manager(v-on:keyup.enter="handleKeys")
    img.s-0.bg-image.row(:class="scene0" src="/assets/images/high_res/big_colored.jpg" ref="s0")
    video.s-1(:class="{ show: currentScene < 7 && currentScene >= 1 }" ref="videoSceneOne")
      source(src="https://s3.amazonaws.com/voice-factory-assets/NFL+VOICE.mp4" type="video/mp4")
    video.s-7(:class="{ show: currentScene === 7 }" ref="videoAnswer" loop preload="metadata")
      source(src="/assets/video/answer.mp4" type="video/mp4")
    video.full-art(:class="{ show: currentScene === 8 }" ref="videoFullArt" preload="metadata")
      source(src="https://s3.amazonaws.com/voice-factory-assets/FINAL.mp4" type="video/mp4")
    audio(ref="background" src="/assets/audio/background.mp3" loop preload="auto")
    audio(ref="vo" :src="currentVo" preload="auto")
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Scenes',

  data() {
    return {
      sequencer: false,
      backgroundVolume: 1
    }
  },

  created() {
    window.addEventListener('keydown', this.handleKeys)
  },

  destroyed() {
    window.removeEventListener('keydown', this.handleKeys)
    this.$refs.videoSceneOne.removeEventListener('ended', this.sceneOneEnd)
    this.$refs.videoSceneOne.removeEventListener('timeupdate', this.durationHandler)
  },

  computed: {
    ...mapGetters({
      currentScene: 'getSceneNumber',
      getAnswerVidState: 'getAnswerVidState',
      getEntityDisplay: 'getEntityDisplay',
      getSkipAnimation: 'getSkipAnimation',
      getStopVO: 'getStopVO'
    }),

    currentVo() {
      const s = this.currentScene
      if (s !== 0 && s !==7) {
        return '/assets/audio/' + this.currentScene + '.mp3'
      } else {
        return '/assets/audio/1.mp3'
      }
    },

    scene0() {
      let classes = ''
      if (this.currentScene === 0) {
        classes = 'show'
      } else if (this.currentScene === 1) {
        classes = 'show animate-zoom-in'
      } else if (this.currentScene === 7) {
        classes = 'show'
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
    this.$refs.videoSceneOne.addEventListener('ended', this.sceneOneEnd)
    this.$refs.videoSceneOne.addEventListener('timeupdate', this.durationHandler)
  },

  methods: {
    ...mapActions({
      setAnswerVidState: 'setAnswerVidState',
      setCurrentScene: 'setSceneNumber',
      setEntityDisplay: 'setEntityDisplay',
      setIntroState: 'setIntroState',
      setReset: 'setReset',
      setSkipAnimation: 'setSkipAnimation',
      setVoActive: 'setVoActive'
    }),

    durationHandler(e) {
      const t = this.$refs.videoSceneOne.currentTime
      if (t > 11 && this.currentScene === 1) {
        this.setCurrentScene(2)
        this.setEntityDisplay(true)
      } else if (t > 20 && this.currentScene === 2) {
        this.setCurrentScene(3)
      } else if (t > 31 && this.currentScene === 3) {
        this.setCurrentScene(4)
      } else if (t > 40 && this.currentScene === 4) {
        this.setCurrentScene(5)
      } else if (t > 51 && this.currentScene === 5) {
        this.setCurrentScene(6)
      } else if (t > 65 && this.currentScene === 6) {
        this.setCurrentScene(7)
      } else if (this.currentScene === 7) {
        this.$refs.videoSceneOne.pause()
      }

      if (t > 17 && this.setEntityDisplay) {
        this.setEntityDisplay(false)
      }
    },

    fadeAudio() {
      let fadeInterval = setInterval(() => {
        if(this.backgroundVolume <= 0){
          this.stopBackgroundAudio()
          clearInterval(fadeInterval)
          this.backgroundVolume = 1
          return
        }
        this.backgroundVolume -= 0.1
      }, 50)
    },

    handleKeys(e) {
      if (/^([0-8])$/.test(e.key)) {
        this.setCurrentScene(parseInt(e.key))
      }
      if (e.key === 's') {
        this.setIntroState(false)
        this.setCurrentScene(0)
        this.$parent.$children[0].$refs.nflVideo.currentTime = 0
        this.$parent.$children[0].$refs.nflVideo.play()
        this.stopVoAudio()
        this.setSkipAnimation(false)
      } else if (e.key === 'f') {
        this.setIntroState(true)
        this.setCurrentScene(0)
        this.stopVoAudio()
        this.setSkipAnimation(false)
      } else if (e.key === 'd') {
        this.setIntroState(true)
        this.setCurrentScene(0)
        this.stopVoAudio()
        this.setSkipAnimation(true)
      }
    },

    playBackgroundAudio() {
      this.$refs.background.currentTime = 0
      this.$refs.background.volume = this.backgroundVolume
      this.$refs.background.play()
    },

    playVoAudio() {
      const s = this.currentScene
      if (s !== 0 && s !== 7 && s !== 8) {
        this.$refs.vo.currentTime = 0
        this.$refs.vo.play()
        this.setVoActive(true)
      }
    },

    playerEnd() {
      this.setVoActive(false)
    },

    sceneOneEnd() {
      // this.setCurrentScene(7)
      // this.$refs.videoSceneTwo.play()
    },

    stopBackgroundAudio() {
      this.$refs.background.pause()
    },

    stopVoAudio() {
      this.$refs.vo.pause()
    },

    startAutomation() {
      this.$refs.videoSceneOne.currentTime = 0
      setTimeout(() => {
        this.$refs.videoSceneOne.play()
      }, 2900)
    }
  },

  watch: {
    currentScene() {
      if (this.currentScene === 0) {
        this.stopBackgroundAudio()
      } else if (this.currentScene === 1) {
        this.playBackgroundAudio()
        this.startAutomation()
      } else if (this.currentScene === 7) {
        this.$refs.videoAnswer.volume = 0
        this.$refs.videoAnswer.play()
        this.setAnswerVidState(true)
        setTimeout(this.fadeAudio(), 500)
      } else if (this.currentScene === 8) {
        this.$refs.videoFullArt.currentTime = 63
        this.$refs.videoFullArt.play()
      } else {
        this.$refs.videoFullArt.pause()
      }
      setTimeout(this.playVoAudio, 2000)
    },

    getAnswerVidState() {
      if(!this.getAnswerVidState) {
        this.$refs.videoAnswer.pause()
        this.$refs.videoAnswer.currentTime = 0
      }
    },

    getStopVO() {
      if (this.getStopVO) {
        this.$refs.vo.pause()
        this.setStopVO(false)
      }
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
  video
    width: 100vw
    height: 100vh
    object-fit: cover
    object-position: top left
    opacity: 0
    position: fixed
    top: 0
    left: 0
    &.s-1
      &.show
        opacity: 1
        transition: opacity .01s ease-in-out
        transition-delay: 3s
    &.s-7
      &.show
        opacity: 1
        transition: opacity .5s ease-in-out
    &.full-art
      &.show
        opacity: 1
        transition: opacity .5s ease-in-out
        z-index: 9999
</style>
