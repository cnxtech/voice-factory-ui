<template lang="pug">
  .nfl-speech-input
    speech-to-text(@onEnd="onEnd" @onRunning="onRunning" ref="speech")
    .content-container
      .content-scene.start(:class="{ show: getCurrentScene === 0 }")
        h1.question(v-if="showCTA") Hit the red button and ask a question about Football Rules or Game Jargon
        .query(v-if="getQuery.length > 0")
          h1 {{ getQuery }}
        // dot-loader(v-show="!result && showLoader")
      .content-scene(:class="{ show: showSceneContent(2) }")
        h1.intent {{ intentMapping[getIntent] }}
        h1.entity {{ getEntity }}
      .content-scene(:class="{ show: getCurrentScene === 7 }")
        h1.answer {{ getAnswer }}
    audio(ref="audio" :src="getAnswerSoundfile" preload="auto")
</template>

<script>
import axios from 'axios'
import json from '@/assets/json/intentMapping.json'
import SpeechToText from './SpeechToText.vue'
import DotLoader from './DotLoader.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Speech',

  components: {
    DotLoader,
    SpeechToText
  },

  data() {
    return {
      result: false,
      currentTranscription: '',
      intentMapping: json,
      showLoader: false,
      showCTA: true
    }
  },

  computed: {
    ...mapGetters({
      getQuery: 'getQuery',
      getAnswer: 'getAnswer',
      getAnswerSSML: 'getAnswerSSML',
      getAnswerSoundfile: 'getAnswerSoundfile',
      getCurrentScene: 'getSceneNumber',
      getEntity: 'getEntity',
      getEntityDisplay: 'getEntityDisplay',
      getError: 'getError',
      getFollowUp: 'getFollowUp',
      getFullResponse: 'getFullResponse',
      getIntent: 'getIntent',
      getReset: 'getReset',
      getSkipAnimation: 'getSkipAnimation',
      getVoActive: 'getVoActive'
    }),

    valid() {
      return this.result && this.result.responseType === 'FULFILLED'
    }
  },

  mounted() {
    this.$refs.audio.addEventListener('ended', this.playerEnd)
  },

  methods: {
    ...mapActions({
      setQuery: 'setQuery',
      setAnswer: 'setAnswer',
      setAnswerSSML: 'setAnswerSSML',
      setAnswerSoundfile: 'setAnswerSoundfile',
      setAnswerVidState: 'setAnswerVidState',
      setActivateSpeechInput: 'setActivateSpeechInput',
      setEntity: 'setEntity',
      setError: 'setError',
      setFollowUp: 'setFollowUp',
      setFullResponse: 'setFullResponse',
      setIntent: 'setIntent',
      setCurrentScene: 'setSceneNumber',
      setReset: 'setReset'
    }),

    grabSSML(r) {
      return r.filter(o => {
        return o.type === 'SSML'
      })[0].fulfillment
    },

    grabText(r) {
      return r.filter(o => {
        return o.type === 'TEXT'
      })[0].fulfillment
    },

    onEnd(transcription) {
      this.showCTA = false
      let query = {
        questionProperties: {
          naturalLanguageQuery: transcription
        }
      }

      // If we have previous response, add to query
      if (this.getFullResponse) {
        const ap = { answerProperties: this.getFullResponse }
        query = {...query, ...ap}
      }

      this.setQuery(transcription)
      this.query(query)
      this.result = false
      this.showLoader = true
    },

    onRunning(transcription) {
      this.showCTA = false
      this.setQuery(transcription)
    },

    parseEntity(obj) {
      const key = Object.keys(obj)[0]
      return { key: key, val: obj[key]}
    },

    parseResults(data) {
      this.result = data

      if(this.getSkipAnimation) {
        setTimeout(() => { this.setCurrentScene(7) }, 2000)
      } else {
        setTimeout(() => { this.setCurrentScene(1) }, 500)
      }

      if (this.valid) {
        this.setIntent(data.responseIntentName)
        this.setFullResponse(data)
        const ent = this.parseEntity(data.alignedVariables)
        const ansSSML = this.grabSSML(data.fulfillmentResponses)
        const ansTEXT = this.grabText(data.fulfillmentResponses)
        this.setAnswer(ansTEXT)
        this.setAnswerSSML(ansSSML)
        this.setEntity(ent.val)
        this.setError(data.responseType)
        this.setFollowUp(data.breadcrumbResponse.response)
      } else {
        this.setAnswer('Sorry, I do not know the answer to this question.')
        this.setAnswerSSML('<lang xml:lang="en-US"><prosody rate="105%">Sorry, I do not know the answer to this question.</prosody></lang>')
        this.setEntity('No Match')
        this.setIntent('No Match')
        this.setFollowUp('')
        this.setError(data.responseType)
      }
    },

    playAudio() {
      this.$refs.speech.stop()
      setTimeout(() => {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      }, 500)
    },

    playerEnd() {
      this.setAnswerVidState(false)
      setTimeout(() => {
        this.setCurrentScene(0)
        // Don't automatically turn on speech recognition.
        // this.$refs.speech.start()
      }, 2500)
    },

    query(query) {
      this.setAnswerSoundfile(false)
      this.setActivateSpeechInput(false)
      // this.$refs.speech.stop()
      axios.post('https://api.jackomatic.com/v1/ask', query)
      .then( response => {
        this.parseResults(response.data.answerProperties)
      })
      .catch( error => {
      })
    },

    getAnswerSpeech() {
      const query = { text: this.getAnswerSSML, type: 'ssml' }
      axios.post('/.netlify/functions/polly', query)
      .then( response => {
        this.setAnswerSoundfile(response.data.url)
      })
      .catch( error => {
      })
    },

    showSceneContent(id) {
      return this.result && this.getCurrentScene === id && this.getEntityDisplay
    },

    stopAudio() {
      this.$refs.audio.pause()
    }
  },

  watch: {
    getAnswer() {
      this.getAnswerSpeech()
    },

    getCurrentScene() {
      if (this.getCurrentScene === 0) {
        this.setQuery('')
        this.showCTA = true
      } else if (this.getCurrentScene === 7 && this.getAnswerSoundfile) {
        setTimeout(this.playAudio, 500)
      }
    },

    getReset() {
      if (this.getReset) {
        this.setReset(false)
        this.setCurrentScene(0)
        this.stopAudio()
      }
    }
  }
}
</script>


<style lang="sass">
  .nfl-speech-input
    position: fixed
    top: 0
    left: 0
    height: 100vh
    width: 100vw
    display: flex
    justify-content: center
    align-items: center
    z-index: 99999999999999999
    .content-container
      width: 80%
      height: auto
      padding-bottom: 10rem
      .content-scene
        opacity: 0
        transition: opacity .25s ease-in-out
        .query
          position: fixed
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
        &:not(.start)
          &.show
            opacity: 1
            transition: opacity .25s ease-in-out
            transition-delay: .25s
        &.start
          &.show
            opacity: 1
            transition: opacity .25s ease-in-out
            transition-delay: .25s
      h1
        text-align: center
        text-transform: capitalize
        margin-bottom: 2.5rem
        font-size: 5.5vw
        line-height: 1.2
        letter-spacing: 1px
        &.intent, &.entity
          position: fixed
          word-wrap: break-word
          font-size: 3vw
          z-index: 9999999999
        &.intent
          top: 16vh
          left: 24.7vw
          width: 30vw
          color: #c9f56a
        &.entity
          top: 86.35vh
          left: 65.4vw
          width: 30vw
          color: #693c39
        &.answer
          width: 60vw
          margin: auto
          text-align: center
          font-weight: normal
          font-family: 'Circular Book'
        &.question
          position: fixed
          top: 50%
          left: 50%
          width: 70vw
          transform: translate(-50%, -50%)
    audio
      display: none
</style>
