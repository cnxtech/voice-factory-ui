import json from '@/assets/json/questions.json'

export default {
  data() {
    return {
      questions: json
    }
  },

  created() {
    window.addEventListener('keydown', this.handleQKeys)
  },

  destroyed() {
    window.removeEventListener('keydown', this.handleQKeys)
  },

  methods: {
    handleQKeys(e) {
      if (e.key === 'q') {
        this.manualQuery(this.questions.player)
      } else if (e.key === 'w') {
        this.manualQuery(this.questions.team)
      } else if (e.key === 'e') {
        this.manualQuery(this.questions.superBowl)
      } else if (e.key === 'r') {
        this.manualQuery(this.questions.gamePlay)
      } else if (e.key === 't') {
        this.manualQuery(this.questions.jargon)
      } else if (e.key === 'y') {
        this.manualQuery(this.questions.position)
      } else if (e.key === 'u') {
        this.manualQuery(this.questions.quantity)
      } else if (e.key === 'i') {
        this.manualQuery(this.questions.halfTime)
      } else if (e.key === 'o') {
        this.manualQuery(this.questions.coaches)
      }
    }
  }
}
