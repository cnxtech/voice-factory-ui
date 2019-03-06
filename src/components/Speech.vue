<template lang="pug">
  .nfl-speech-input
    speech-to-text(@onEnd="onEnd" @onRunning="onRunning" ref="speech")
    .content-container
      .content-scene-0(v-show="getCurrentScene === 0")
        h1 Please ask a question
        .query(v-if="getQuery.length > 0")
          h1 {{ getQuery }}?
        dot-loader(v-show="!result && showLoader")
      .content-scene-1(v-show="result && getCurrentScene === 1")
        h1 Processing request
        dot-loader
      .content-scene-2(v-show="result && getCurrentScene === 2")
         h1 Intent & Entity mapping
         h1 Intent: {{ getIntent }}
         h1 Entity: {{ getEntity }}
      .content-scene-3(v-show="result && getCurrentScene === 3")
         h1 Answering the question
      .content-scene-4(v-show="result && getCurrentScene === 4")
         h1 Answering on Error
         h1 State: {{ getError }}
      .content-scene-5(v-show="result && getCurrentScene === 5")
        h1 Looking for Media Content
      .content-scene-6(v-show="result && getCurrentScene === 6")
        h1 Answer: {{ getAnswer }}
    audio(ref="audio" :src="getAnswerSoundfile" preload="auto")
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
      getFullResponse: 'getFullResponse',
      getIntent: 'getIntent'
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
      // For future references.
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
      this.setCurrentScene(1)
      if (this.valid) {
        this.setIntent(data.responseIntentName)
        this.setFullResponse(data)
        const ent = this.parseEntity(data.alignedVariables)
        this.setAnswer(data.fulfillmentResponses[0].fulfillment)
        this.setEntity(ent.key + ' / ' + ent.val)
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
      const play = this.$refs.audio.play()
    },

    playerEnd() {
      this.$refs.speech.start()
      this.setCurrentScene(7)
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
      axios.post('/.netlify/functions/polly', query)
      .then( response => {
        this.setAnswerSoundfile(response.data.url)
      })
      .catch( error => {
      })
    }
  },

  watch: {
    getAnswer() {
      this.getAnswerSpeech()
    },

    getCurrentScene() {
      if (this.getCurrentScene === 0) {
        this.setQuery('')
      } else if(this.getAnswerSoundfile && this.getCurrentScene === 6) {
        setTimeout(this.playAudio, 2000)
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
      width: 80%
      height: auto
      padding-bottom: 10rem
      h1
        text-align: center
        text-transform: capitalize
        margin-bottom: 2.5rem
        font-size: 6.5vw
    audio
      display: none
</style>
