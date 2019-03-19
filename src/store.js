import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	query: '',
    activateSpeechInput: false,
  	answer: '',
    answerSSML: '',
    answerSoundfile: false,
    answerVidState: false,
    currentScene: 0,
  	entity: '',
    entityDisplay: true,
    error: '',
    followUp: '',
    fullResponse: false,
  	intent: '',
    introEnded: false,
    resetToInput: false,
    skipAnimation: false,
    soundCapture: false,
    stopVO: false,
    voActive: false,
  },

  mutations: {
	 	storeQuery(state, val) {
	    state.query = val
	  },

    storeActivateSpeechInput(state, val) {
      state.activateSpeechInput = val
    },

	  storeAnswer(state, val) {
	    state.answer = val
	  },

    storeAnswerSSML(state, val) {
      state.answerSSML = val
    },

    storeAnswerSoundfile(state, val) {
      state.answerSoundfile = val
    },

    storeAnswerVidState(state, val) {
      state.answerVidState = val
    },

	  storeEntity(state, val) {
	    state.entity = val
	  },

    storeEntityDisplay(state, val) {
      state.entityDisplay = val
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

    storeReset(state, val) {
      state.resetToInput = val
    },

    storeSceneNumber(state, val) {
      state.currentScene = val
    },

    storeSkipAnimation(state, val) {
      state.skipAnimation = val
    },

    storeSoundCapture(state, val) {
      state.soundCapture = val
    },

    storeStopVO(state, val) {
      state.stopVO = val
    },

    storeVoActive(state, val) {
      state.voActive = val
    }
  },

  actions: {
		setQuery({ commit }, val) {
	    commit('storeQuery', val)
  	},

    setAnswer({ commit }, val) {
      commit('storeAnswer', val)
    },

		setActivateSpeechInput({ commit }, val) {
	    commit('storeActivateSpeechInput', val)
  	},

    setAnswerSSML({ commit }, val) {
      commit('storeAnswerSSML', val)
    },

    setAnswerSoundfile({ commit }, val) {
      commit('storeAnswerSoundfile', val)
    },

    setAnswerVidState({ commit }, val) {
      commit('storeAnswerVidState', val)
    },

  	setEntity({ commit }, val) {
	    commit('storeEntity', val)
  	},

    setEntityDisplay({ commit }, val) {
      commit('storeEntityDisplay', val)
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

    setReset({ commit }, val) {
      commit('storeReset', val)
    },

    setSceneNumber({ commit }, val) {
      commit('storeSceneNumber', val)
    },

    setSkipAnimation({ commit }, val) {
      commit('storeSkipAnimation', val)
    },

    setSoundCapture({ commit }, val) {
      commit('storeSoundCapture', val)
    },

    setStopVO({ commit }, val) {
      commit('storeStopVO', val)
    },

    setVoActive({ commit }, val) {
      commit('storeVoActive', val)
    }
  },

  getters: {
  	getQuery(state) {
  		return state.query
  	},

    getActivateSpeechInput(state) {
      return state.activateSpeechInput
    },

  	getAnswer(state) {
  		return state.answer
  	},

    getAnswerSSML(state) {
      return state.answerSSML
    },

    getAnswerSoundfile(state) {
      return state.answerSoundfile
    },

    getAnswerVidState(state) {
      return state.answerVidState
    },

  	getEntity(state) {
  		return state.entity
  	},

    getEntityDisplay(state) {
      return state.entityDisplay
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

    getReset(state) {
      return state.resetToInput
    },

    getSceneNumber(state) {
      return state.currentScene
    },

    getSkipAnimation(state) {
      return state.skipAnimation
    },

    getSoundCapture(state) {
      return state.soundCapture
    },

    getStopVO(state) {
      return state.stopVO
    },

    getVoActive(state) {
      return state.voActive
    }
  }
})
