<template lang="pug">
  #app
    intro.intro(:class="{ show: !getIntroState }")
    speech(v-if="getIntroState")
    scenes
</template>

<script>
import Intro from './components/Intro.vue'
import Speech from './components/Speech.vue'
import Scenes from './components/Scenes.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'app',

  components: {
    Intro,
    Scenes,
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
    position: relative
    top: 0
    left: 0
    opacity: 0
    transition: opacity 1s ease-in-out
    &.show
      opacity: 1
</style>
