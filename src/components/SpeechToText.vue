<template lang="pug">
  div
</template>

<script>
export default {
  name: 'SpeechToText',

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

  methods: {
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
          this.$emit('onEnd', this.transcription)
        }
        this.runtimeTranscription = ''
        // this.recognition.start()
      })

      this.recognition.start()
    },

    start() {
      console.log('start')
      this.recognition.start()
    },

    stop() {
      console.log('stop')
      this.recognition.stop()
    }
  },

  mounted () {
    this.initApi()
  }
}
</script>
