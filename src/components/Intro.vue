<template lang="pug">
  .nfl-voice-intro(@click="playVideo")
    video(preload autoplay ref="nflVideo")
      source(src="/assets/video/intro.mp4" type="video/mp4")
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Intro',

  data() {
    return {
      end: false
    }
  },

  computed: {
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

    handleEnd() {
      this.setIntroState(true)
    },

    playVideo() {
      this.vidEl.play()
    }
  }
}
</script>


<style lang="sass">
  .nfl-voice-intro
    video
      width: 100vw
      height: 100vh
      object-fit: cover
</style>
