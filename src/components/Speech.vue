<template lang="pug">
  .nfl-voice-experiment
    speech-to-text(@onEnd="onEnd" @onRunning="onRunning")
    .query
      h1 {{ currentTranscription }}
    .content(v-if="result")
      h1 Intent: {{ intent }}
      h1 Entity: {{ entity }}
      h1 Answer: {{ answer }}
</template>

<script>
import axios from 'axios'
import SpeechToText from './SpeechToText.vue'

export default {
  name: 'HelloWorld',

  components: {
    SpeechToText
  },

  data() {
    return {
      result: false,
      currentTranscription: ''
    }
  },

  computed: {
    intent() {
      return this.valid ? this.result.responseIntentName : false
    },

    entity() {
      return this.valid ? this.result.alignedVariables.FootballTerm : false
    },

    answer() {
      return this.valid ? this.result.fulfillmentResponses[0].fulfillment : false
    },

    valid() {
      return this.result && this.result.responseType === 'FULFILLED'
    }
  },

  methods: {
    onEnd(transcription) {
      const query = {
        questionProperties: {
          naturalLanguageQuery: transcription
        }
      }
      this.query(query)
      this.result = false
    },

    onRunning(transcription) {
      this.currentTranscription = transcription
    },

    query(query) {
      axios.post('https://18.235.66.33:8099/v1/ask', query)
      .then( response => {
        console.log(response.data)
        this.result = response.data.answerProperties
      })
      .catch( error => {
        console.log(error)
      })
    }
  }
}
</script>


<style lang="sass">

</style>
