<template lang="pug">
  .nfl-voice-intro
    video#nfl-video(preload autoplay)
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

  mounted() {
    const vid = document.getElementById('nfl-video')
    vid.addEventListener('ended', this.handleEnd)
  },

  methods: {
    ...mapActions({
      setIntroState: 'setIntroState'
    }),

    handleEnd() {
      this.setIntroState(true)
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
