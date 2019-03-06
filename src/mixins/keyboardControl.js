import json from '@/assets/json/questions.json'

export default {
  data() {
    return {
      questions: json
    }
  },

  computed: {
    players() {
      return this.questions.players
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
        this.manualQuery(this.players[0])
      } else if (e.key === 'w') {
        this.manualQuery(this.players[1])
      }
    }
  }
}
