<template lang="pug">
  .nfl-voice-intro(@keydown="handleClick")
    .screen-saver(:class="{ show: screenSaver }")
      h1 Screen Saver Placeholder
    video(preload ref="nflVideo" v-show="!getIntroState")
      source(src="/assets/video/current.m4v" type="video/mp4")
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Intro',

  data() {
    return {
      end: false,
      screenSaver: true
    }
  },

  created() {
    window.addEventListener('keydown', this.handleClick)
  },

  destroyed() {
    window.removeEventListener('keydown', this.handleClick)
  },

  computed: {
    ...mapGetters({
      getIntroState: 'getIntroState'
    }),

    vidEl() {
      return this.$refs.nflVideo
    }
  },

  mounted() {
    this.vidEl.addEventListener('ended', this.handleEnd)
  },

  methods: {
    ...mapActions({
      setIntroState: 'setIntroState'
    }),

    handleClick(e) {
      if (e.key === 's') {
        this.screenSaver = false
        this.playVideo()
      } else if (e.key === 'f') {
        this.setIntroState(true)
        this.stopVideo()
        this.screenSaver = false
      }
    },

    handleEnd() {
      this.setIntroState(true)
    },

    playVideo() {
      if (!this.getIntroState) {
        this.vidEl.currentTime = 0
        this.vidEl.play()
      }
    },

    stopVideo() {
      this.vidEl.pause()
    }
  }
}
</script>


<style lang="sass">
  .nfl-voice-intro
    .screen-saver
      width: 100vw
      height: 100vh
      display: flex
      justify-content: center
      align-items: center
      position: fixed
      z-index: 99
      background-color: #FFF
      transition: opacity .05s ease-in-out
      opacity: 0
      &.show
        opacity: 1
    video
      width: 100vw
      height: 100vh
      object-fit: cover
</style>
