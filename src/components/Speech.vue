<template lang="pug">
  .nfl-speech-input
    speech-to-text(@onEnd="onEnd" @onRunning="onRunning" ref="speech")
    .content-container
      .content-scene.start(:class="{ show: getCurrentScene === 0 }")
        h1 Please ask a question
        .query(v-if="getQuery.length > 0")
          h1 {{ getQuery }}
        dot-loader(v-show="!result && showLoader")
      // .content-scene(:class="{ show: showSceneContent(1) }")
      //   h1 Processing request
      //   dot-loader
      .content-scene(:class="{ show: showSceneContent(2) }")
        h1.intent {{ intentMapping[getIntent] }}
        h1.entity {{ getEntity }}
      // .content-scene(:class="{ show: showSceneContent(3) }")
      //   h1 Answering the question
      // .content-scene(:class="{ show: showSceneContent(4) }")
      //  h1 Answering on Error
      //  h1 State: {{ getError }}
      // .content-scene(:class="{ show: showSceneContent(5) }")
      //   h1 Looking for Media Content
      // .content-scene(:class="{ show: showSceneContent(7) }")
      //   h1 Answer: {{ getAnswer }}
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
      getError: 'getError',
      getFollowUp: 'getFollowUp',
      getFullResponse: 'getFullResponse',
      getIntent: 'getIntent',
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

    parseEntity(obj) {
      const key = Object.keys(obj)[0]
      return { key: key, val: obj[key]}
    },

    onEnd(transcription) {
      let query = {
        questionProperties: {
          naturalLanguageQuery: transcription
        }
      }
      // TODO: For future references.
      // if (this.getFullResponse) {
      //   const ap = { answerProperties: this.getFullResponse }
      //   query = {...query, ...ap}
      // }
      this.setQuery(transcription)
      this.query(query)
      this.result = false
      this.showLoader = true
    },

    onRunning(transcription) {
      this.setQuery(transcription)
    },

    parseResults(data) {
      this.result = data
      setTimeout(() => { this.setCurrentScene(1) }, 1000)
      if (this.valid) {
        this.setIntent(data.responseIntentName)
        this.setFullResponse(data)
        const ent = this.parseEntity(data.alignedVariables)
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
      setTimeout(() => { this.setCurrentScene(7) }, 100)
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
      return this.result && this.getCurrentScene === id
    }
  },

  watch: {
    getAnswer() {
      this.getAnswerSpeech()
    },

    getCurrentScene() {
      if (this.getCurrentScene === 0) {
        this.setQuery('')
      } else if (this.getCurrentScene === 7) {
        setTimeout(() => this.setCurrentScene(0), 3000)
      }
    },

    getVoActive() {
      if(this.getAnswerSoundfile && this.getCurrentScene === 6 && !this.getVoActive) {
        setTimeout(this.playAudio, 1000)
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
        transition: opacity 1s ease-in-out
        &:not(.start)
          &.show
            opacity: 1
            transition: opacity .25s ease-in-out
            transition-delay: 1s
        &.start
          &.show
            opacity: 1
            transition: opacity .25s ease-in-out
            transition-delay: .5s
      h1
        text-align: center
        text-transform: capitalize
        margin-bottom: 2.5rem
        font-size: 6.5vw
        &.intent, &.entity
          position: fixed
          word-wrap: break-word
          font-size: 4rem
          z-index: 9999999999
        &.intent
          top: 37.5rem
          left: 30rem
          width: 40rem
          color: #c9f56a
        &.entity
          top: 184rem
          left: 78rem
          width: 40rem
          color: #693c39
    audio
      display: none
</style>
