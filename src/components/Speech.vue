<template lang="pug">
  .nfl-speech-input
    speech-to-text(@onEnd="onEnd" @onRunning="onRunning" ref="speech")
    .content-container
      .content-scene.start(:class="{ show: getCurrentScene === 0 }")
        // h1 Please ask a question
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
      showLoader: false
    }
  },

  computed: {
    ...mapGetters({
      getQuery: 'getQuery',
      getAnswer: 'getAnswer',
      getAnswerSoundfile: 'getAnswerSoundfile',
      getCurrentScene: 'getSceneNumber',
      getEntity: 'getEntity',
      getEntityDisplay: 'getEntityDisplay',
      getError: 'getError',
      getFollowUp: 'getFollowUp',
      getFullResponse: 'getFullResponse',
      getIntent: 'getIntent',
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
      setAnswerSoundfile: 'setAnswerSoundfile',
      setEntity: 'setEntity',
      setError: 'setError',
      setFollowUp: 'setFollowUp',
      setFullResponse: 'setFullResponse',
      setIntent: 'setIntent',
      setCurrentScene: 'setSceneNumber'
    }),

    grabSSML(r) {
      r.map(o => {
        return o.type === 'TEXT'
      })
    },

    onEnd(transcription) {
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
      this.setQuery(transcription)
    },

    parseEntity(obj) {
      const key = Object.keys(obj)[0]
      return { key: key, val: obj[key]}
    },

    parseResults(data) {
      this.result = data

      if(this.getSkipAnimation) {
        setTimeout(() => { this.setCurrentScene(7) }, 500)
      } else {
        setTimeout(() => { this.setCurrentScene(1) }, 500)
      }

      if (this.valid) {
        this.setIntent(data.responseIntentName)
        this.setFullResponse(data)
        const ent = this.parseEntity(data.alignedVariables)
        const ans = this.grabSSML(data.fulfillmentResponses)
        this.setAnswer(data.fulfillmentResponses[0].fulfillment)
        this.setEntity(ent.val)
        this.setError(data.responseType)
        this.setFollowUp(data.breadcrumbResponse.response)
      } else {
        this.setAnswer('Sorry, I do not know the answer to this question.')
        this.setEntity('')
        this.setIntent('')
        this.setFollowUp('')
        this.setError(data.responseType)
      }
    },

    playAudio() {
      this.$refs.speech.stop()
      setTimeout(() => {
        this.$refs.audio.play()
      }, 500)
    },

    playerEnd() {
      this.$refs.speech.start()
      setTimeout(() => { this.setCurrentScene(0) }, 1000)
    },

    query(query) {
      this.setAnswerSoundfile(false)
      this.$refs.speech.stop()
      axios.post('https://api.jackomatic.com/v1/ask', query)
      .then( response => {
        this.parseResults(response.data.answerProperties)
      })
      .catch( error => {
      })
    },

    getAnswerSpeech() {
      const query = { text: this.getAnswer }
      axios.post('/.netlify/functions/polly', query)
      .then( response => {
        this.setAnswerSoundfile(response.data.url)
      })
      .catch( error => {
      })
    },

    showSceneContent(id) {
      return this.result && this.getCurrentScene === id && this.getEntityDisplay
    }
  },

  watch: {
    getAnswer() {
      this.getAnswerSpeech()
    },

    getCurrentScene() {
      console.log(this.getCurrentScene)
      if (this.getCurrentScene === 0) {
        this.setQuery('')
      } else if (this.getCurrentScene === 7 && this.getAnswerSoundfile) {
        setTimeout(this.playAudio, 500)
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
        &.intent, &.entity
          position: fixed
          word-wrap: break-word
          font-size: 4rem
          z-index: 9999999999
        &.intent
          top: 34.5rem
          left: 30rem
          width: 40rem
          color: #c9f56a
        &.entity
          top: 186rem
          left: 78rem
          width: 40rem
          color: #693c39
        &.answer
          width: 60vw
          margin: auto
          text-align: center
    audio
      display: none
</style>
