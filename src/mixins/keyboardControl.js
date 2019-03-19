import json from '@/assets/json/questions.json'
import { mapActions } from 'vuex'

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
    ...mapActions({
      setReset: 'setReset'
    }),

    handleQKeys(e) {
      if (e.key === 'q') {
        this.emitQeury(this.questions.player, 0)
      } else if (e.key === 'w') {
        this.emitQeury(this.questions.team, 1)
      } else if (e.key === 'e') {
        this.emitQeury(this.questions.superBowl, 2)
      } else if (e.key === 'r') {
        this.emitQeury(this.questions.gamePlay, 3)
      } else if (e.key === 't') {
        this.emitQeury(this.questions.jargon, 4)
      } else if (e.key === 'y') {
        this.emitQeury(this.questions.position, 5)
      } else if (e.key === 'u') {
        this.emitQeury(this.questions.quantity, 6)
      } else if (e.key === 'i') {
        this.emitQeury(this.questions.halfTime, 7)
      } else if (e.key === 'o') {
        this.emitQeury(this.questions.coaches, 8)
      }
    },

    emitQeury(question, sound) {
      this.setReset(true)
      setTimeOut(() => {
        this.manualQuery(question)
        this.questionSound = this.sounds[sound]
      }, 100)
    }
  }
}
