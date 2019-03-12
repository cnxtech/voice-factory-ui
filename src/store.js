import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	query: '',
  	answer: '',
    answerSoundfile: false,
    soundCapture: false,
  	entity: '',
    error: '',
  	intent: '',
    followUp: '',
  	introEnded: false,
    currentScene: 0,
    fullResponse: false,
    voActive: false
  },

  mutations: {
	 	storeQuery(state, val) {
	    state.query = val
	  },

	  storeAnswer(state, val) {
	    state.answer = val
	  },

    storeAnswerSoundfile(state, val) {
      state.answerSoundfile = val
    },

	  storeEntity(state, val) {
	    state.entity = val
	  },

    storeError(state, val) {
      state.error = val
    },

    storeFullResponse(state, val) {
      state.fullResponse = val
    },

	  storeIntent(state, val) {
	  	state.intent = val
	  },

    storeFollowUp(state, val) {
      state.followUp = val
    },

	  storeIntroState(state, val) {
	  	state.introEnded = val
	  },

    storeSceneNumber(state, val) {
      state.currentScene = val
    },

    storeSoundCapture(state, val) {
      state.soundCapture = val
    },

    storeVoActive(state, val) {
      state.voActive = val
    },
  },

  actions: {
		setQuery({ commit }, val) {
	    commit('storeQuery', val)
  	},

		setAnswer({ commit }, val) {
	    commit('storeAnswer', val)
  	},

    setAnswerSoundfile({ commit }, val) {
      commit('storeAnswerSoundfile', val)
    },

  	setEntity({ commit }, val) {
	    commit('storeEntity', val)
  	},

    setError({ commit }, val) {
      commit('storeError', val)
    },

    setFullResponse({ commit }, val) {
      commit('storeFullResponse', val)
    },

		setIntent({ commit }, val) {
	    commit('storeIntent', val)
  	},

    setFollowUp({ commit }, val) {
      commit('storeFollowUp', val)
    },

		setIntroState({ commit }, val) {
	    commit('storeIntroState', val)
  	},

    setSceneNumber({ commit }, val) {
      commit('storeSceneNumber', val)
    },

    setSoundCapture({ commit }, val) {
      commit('storeSoundCapture', val)
    },

    setVoActive({ commit }, val) {
      commit('storeVoActive', val)
    },
  },

  getters: {
  	getQuery(state) {
  		return state.query
  	},

  	getAnswer(state) {
  		return state.answer
  	},

    getAnswerSoundfile(state) {
      return state.answerSoundfile
    },

  	getEntity(state) {
  		return state.entity
  	},

    getError(state) {
      return state.error
    },

    getFullResponse(state) {
      return state.fullResponse
    },

  	getIntent(state) {
  		return state.intent
  	},

    getFollowUp(state) {
      return state.followUp
    },

  	getIntroState(state) {
  		return state.introEnded
  	},

    getSceneNumber(state) {
      return state.currentScene
    },

    getSoundCapture(state) {
      return state.soundCapture
    },

    getVoActive(state) {
      return state.voActive
    }
  }
})
