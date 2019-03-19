<template lang="pug">
  div
    audio(ref="questions" :src="questionSound" preload="auto")
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
      recognition: null,
      sounds: [
        '/assets/audio/q1.mp3',
        '/assets/audio/q2.mp3',
        '/assets/audio/q3.mp3',
        '/assets/audio/q4.mp3',
        '/assets/audio/q5.mp3',
        '/assets/audio/q6.mp3',
        '/assets/audio/q7.mp3',
        '/assets/audio/q8.mp3',
        '/assets/audio/q9.mp3'
      ]
    }
  },

  computed: {
    ...mapGetters({
      currentScene: 'getSceneNumber',
      getActivateSpeechInput: 'getActivateSpeechInput'
    })
  },

  methods: {
    ...mapActions({
      setSkipAnimation: 'setSkipAnimation',
      setActivateSpeechInput: 'setActivateSpeechInput'
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

      // this.recognition.start()
    },

    start() {
      // console.log(this.recognition, this.recognition.start())
      this.recognition.start()
    },

    stop() {
      this.recognition.stop()
    },

    manualQuery(query) {
      this.setSkipAnimation(true)
      this.transcription = query
      this.$emit('onEnd', this.transcription)
      setTimeout(() => { this.$refs.questions.play() }, 100)
    }
  },

  watch: {
    getActivateSpeechInput() {
      if (this.getActivateSpeechInput) {
        console.log('activate')
        this.start()
      } else {
        console.log('de-activate')
        this.stop()
      }
    }
  },

  mounted () {
    this.initApi()
  }
}
</script>
