<template lang="pug">
  .nfl-speech-input
    speech-to-text(@onEnd="onEnd" @onRunning="onRunning" ref="speech")
    .content-container
      h1 Please ask a question
      .query(v-if="getQuery.length > 0")
        h1 {{ getQuery }}?
      dot-loader(v-show="!result && showLoader")
      .content(v-if="result")
        h1 State: {{ getError }}
        h1 Intent: {{ getIntent }}
        h1 Entity: {{ getEntity }}
        h1 Answer: {{ getAnswer }}
        h1 Follow Up: {{ getFollowUp }}
    audio(ref="audio" :src="getAnswerSoundfile" preload="auto" v-if='getAnswerSoundfile')
</template>

<script>
import axios from 'axios'
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
      getIntent: 'getIntent'
    }),

    valid() {
      return this.result && this.result.responseType === 'FULFILLED'
    }
  },

  methods: {
    ...mapActions({
      setQuery: 'setQuery',
      setAnswer: 'setAnswer',
      setAnswerSoundfile: 'setAnswerSoundfile',
      setEntity: 'setEntity',
      setError: 'setError',
      setFollowUp: 'setFollowUp',
      setIntent: 'setIntent',
      setCurrentScene: 'setSceneNumber'
    }),

    onEnd(transcription) {
      const query = {
        questionProperties: {
          naturalLanguageQuery: transcription
        }
      }
      this.query(query)
      this.result = false
      this.showLoader = true
    },

    onRunning(transcription) {
      this.setQuery(transcription)
    },

    parseResults(data) {
      this.result = data
      this.setCurrentScene(1)
      if (this.valid) {
        this.setAnswer(data.fulfillmentResponses[0].fulfillment)
        this.setEntity(data.alignedVariables.FootballTerm)
        this.setError(data.responseType)
        this.setFollowUp(data.breadcrumbResponse.response)
        this.setIntent(data.responseIntentName)
      } else {
        this.setAnswer('Sorry, I do not know the answer to this question.')
        this.setEntity('')
        this.setIntent('')
        this.setFollowUp('')
        this.setError(data.responseType)
      }
    },

    query(query) {
      this.setAnswerSoundfile(false)
      axios.post('https://api.jackomatic.com/v1/ask', query)
      .then( response => {
        this.parseResults(response.data.answerProperties)
      })
      .catch( error => {
      })
    },

    getAnswerSpeech() {
      const query = { text: this.getAnswer }
      axios.post('https://voicefactory-staging.netlify.com/.netlify/functions/polly', query)
      .then( response => {
        console.log(this.getAnswerSoundfile, response, response.data.url)
        this.setAnswerSoundfile(response.data.url)
        console.log(this.getAnswerSoundfile)
      })
      .catch( error => {
      })
    }
  },

  watch: {
    getAnswer() {
      this.getAnswerSpeech()
    },

    getAnswerSoundfile() {
      console.log(this.getAnswerSoundfile, this.$refs.audio)
      if(this.getAnswerSoundfile) {
        this.$refs.audio.play()
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
    .content-container
      width: 75%
      height: auto
      padding-bottom: 10rem
      h1
        text-align: center
        text-transform: capitalize
        margin-bottom: 2.5rem
    audio
      display: none
</style>
