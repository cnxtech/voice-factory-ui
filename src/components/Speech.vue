<template lang="pug">
  .nfl-speech-input
    speech-to-text(@onEnd="onEnd" @onRunning="onRunning")
    .content-container
      h1 Please ask a question
      .query(v-if="getQuery.length > 0")
        h1 {{ getQuery }}?
      dot-loader(v-show="!result && showLoader")
      .content(v-if="result")
        h1 Intent: {{ getIntent }}
        h1 Entity: {{ getEntity }}
        h1 Answer: {{ getAnswer }}
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
      getEntity: 'getEntity',
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
      setEntity: 'setEntity',
      setIntent: 'setIntent'
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
      if (this.valid) {
        this.setAnswer(data.fulfillmentResponses[0].fulfillment)
        this.setEntity(data.alignedVariables.FootballTerm)
        this.setIntent(data.responseIntentName)
      } else {
        this.setAnswer('Mmhh...')
        this.setEntity('')
        this.setIntent('')
      }
    },

    query(query) {
      axios.post('http://18.235.66.33:8099/v1/ask', query)
      .then( response => {
        // console.log(response.data)
        this.parseResults(response.data.answerProperties)
      })
      .catch( error => {
        // console.log(error)
      })
    }
  }
}
</script>


<style lang="sass">
  .nfl-speech-input
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
</style>
