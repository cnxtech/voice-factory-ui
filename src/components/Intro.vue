<template lang="pug">
  .nfl-voice-intro(@keydown="handleClick")
    .screen-saver(:class="{ show: screenSaver }")
      swiper(:options="swiperOption")
        swiper-slide(v-for="image in images")
          img.slide(:src="image")
    video(preload ref="nflVideo" v-show="!getIntroState")
      source(src="/assets/video/current.m4v" type="video/mp4")
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import 'swiper/dist/css/swiper.css'

import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'Intro',

  components: {
    swiper,
    swiperSlide
  },

  data() {
    return {
      end: false,
      screenSaver: true,
      swiperOption: {
        autoplay: {
          delay: 5000
        },
        effect: 'fade',
        speed: 750,
        loop: true
      },
      images: [
        '/assets/images/screensaver/1.jpg',
        '/assets/images/screensaver/2.jpg',
        '/assets/images/screensaver/3.jpg',
        '/assets/images/screensaver/4.jpg',
        '/assets/images/screensaver/5.jpg',
        '/assets/images/screensaver/6.jpg',
        '/assets/images/screensaver/7.jpg',
        '/assets/images/screensaver/8.jpg'
      ]
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
        this.scenterVcenter()
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
        .slide
          width: 100%
          height: 100%
          object-fit: cover
          object-position: center center
    video
      width: 100vw
      height: 100vh
      object-fit: cover
</style>
