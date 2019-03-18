<template lang="pug">
  div
</template>

<script>
import keyboardControl from '@/mixins/keyboardControl.js'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SpeechToText',

  mixins: [keyboardControl],

  props: {
    lang: {
      type: String,
      default: 'en-US'
    }
  },

  data() {
    return {
      runtimeTranscription: '',
      transcription: '',
      recognition: null
    }
  },

  computed: {
    ...mapGetters({
      currentScene: 'getSceneNumber'
    })
  },

  methods: {
    ...mapActions({
      setSkipAnimation: 'setSkipAnimation'
    }),

    initApi () {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition && process.env.NODE_ENV !== 'production') {
        throw new Error('Speech Recognition does not exist on this browser. Use Chrome or Firefox')
      }

      if (!SpeechRecognition) {
        return
      }

      this.recognition = new SpeechRecognition()
      this.recognition.lang = this.lang
      this.recognition.interimResults = true

      this.recognition.addEventListener('result', event => {
        const text = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        this.runtimeTranscription = text
        this.$emit('onRunning', this.runtimeTranscription)
      })

      this.recognition.addEventListener('end', () => {
        if (this.runtimeTranscription !== '') {
          this.transcription = this.runtimeTranscription
          this.setSkipAnimation(false)
          this.$emit('onEnd', this.transcription)
        }
        this.runtimeTranscription = ''
        // this.recognition.start()
      })

      this.recognition.start()
    },

    start() {
      this.recognition.start()
    },

    stop() {
      this.recognition.stop()
    },

    manualQuery(query) {
      this.setSkipAnimation(true)
      this.transcription = query
      this.$emit('onEnd', this.transcription)
    }
  },

  mounted () {
    this.initApi()
  }

  // watch: {
  //   currentScene() {
  //     if (this.currentScene === 0) {
  //       this.initApi()
  //     }
  //   }
  // }
}
</script>
