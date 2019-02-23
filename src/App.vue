<template lang="pug">
  #app
    Intro.intro(:class="{ show: !getIntroState }")
    Speech(v-if="getIntroState")
    img.bg-image(src="/assets/images/sketch.jpg")
</template>

<script>
import Intro from './components/Intro.vue'
import Speech from './components/Speech.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'app',

  components: {
    Intro,
    Speech
  },

  computed: {
  	...mapGetters({
  		getIntroState: 'getIntroState'
  	})
  }
}
</script>

<style lang="sass">
  @import 'styles/main.sass'
  .intro
    position: fixed
    top: 0
    left: 0
    opacity: 0
    transition: opacity 1s ease-in-out
    &.show
      opacity: 1
  .bg-image
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    object-fit: cover
    z-index: -1
    opacity: 0.3
</style>
