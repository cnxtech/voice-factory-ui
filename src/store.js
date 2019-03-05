import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	query: '',
  	answer: '',
    answerSoundfile: false,
  	entity: '',
    error: '',
  	intent: '',
    followUp: '',
  	introEnded: false,
    currentScene: 0
  },

  mutations: {
	 	storeQuery: function(state, val) {
	    state.query = val
	  },

	  storeAnswer: function(state, val) {
	    state.answer = val
	  },

    storeAnswerSoundfile: function(state, val) {
      state.answerSoundfile = val
    },

	  storeEntity: function(state, val) {
	    state.entity = val
	  },

    storeError: function(state, val) {
      state.error = val
    },

	  storeIntent: function(state, val) {
	  	state.intent = val
	  },

    storeFollowUp: function(state, val) {
      state.followUp = val
    },

	  storeIntroState: function(state, val) {
	  	state.introEnded = val
	  },

    storeSceneNumber: function(state, val) {
      state.currentScene = val
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
    }
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
    }
  }
})
