import json from '@/assets/json/questions.json'

export default {
  data() {
    return {
      questions: json,
      questionSound: ''
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
        this.questionSound = this.sounds[0]
      } else if (e.key === 'w') {
        this.manualQuery(this.questions.team)
        this.questionSound = this.sounds[1]
      } else if (e.key === 'e') {
        this.manualQuery(this.questions.superBowl)
        this.questionSound = this.sounds[2]
      } else if (e.key === 'r') {
        this.manualQuery(this.questions.gamePlay)
        this.questionSound = this.sounds[3]
      } else if (e.key === 't') {
        this.manualQuery(this.questions.jargon)
        this.questionSound = this.sounds[4]
      } else if (e.key === 'y') {
        this.manualQuery(this.questions.position)
        this.questionSound = this.sounds[5]
      } else if (e.key === 'u') {
        this.manualQuery(this.questions.quantity)
        this.questionSound = this.sounds[6]
      } else if (e.key === 'i') {
        this.manualQuery(this.questions.halfTime)
        this.questionSound = this.sounds[7]
      } else if (e.key === 'o') {
        this.manualQuery(this.questions.coaches)
        this.questionSound = this.sounds[8]
      }
    }
  }
}
