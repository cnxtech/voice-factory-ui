<template lang="pug">
  .nfl-speech-input
    speech-to-text(@onEnd="onEnd" @onRunning="onRunning" ref="speech")
    .content-container(v-if="getCurrentScene === 0")
      h1 Please ask a question
      .query(v-if="getQuery.length > 0")
        h1 {{ getQuery }}?
      dot-loader(v-show="!result && showLoader")
      // .content(v-if="result")
      //  h1 State: {{ getError }}
      //  h1 Intent: {{ getIntent }}
      //  h1 Entity: {{ getEntity }}
      //  h1 Answer: {{ getAnswer }}
      //  h1 Follow Up: {{ getFollowUp }}
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
      axios.post('http://18.235.66.33:8099/v1/ask', query)
      .then( response => {
        this.parseResults(response.data.answerProperties)
      })
      .catch( error => {
      })
    },

    readAnswer() {
      // this.$refs.speech.stop()
      // let answer = new SpeechSynthesisUtterance(this.getAnswer)
      // window.speechSynthesis.speak(answer)
      // answer.onend = (e) => {
      //   this.$refs.speech.start()
      // }
    }
  },

  watch: {
    getAnswer() {
      this.readAnswer()
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
</style>
