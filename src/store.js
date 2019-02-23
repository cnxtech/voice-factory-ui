import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	query: '',
  	answer: '',
  	entity: '',
    error: '',
  	intent: '',
    followUp: '',
  	introEnded: false
  },

  mutations: {
	 	storeQuery: function(state, val) {
	    state.query = val
	  },

	  storeAnswer: function(state, val) {
	    state.answer = val
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
	  }
  },

  actions: {
		setQuery({ commit }, val) {
	    commit('storeQuery', val)
  	},

		setAnswer({ commit }, val) {
	    commit('storeAnswer', val)
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
  	}
  },

  getters: {
  	getQuery(state) {
  		return state.query
  	},

  	getAnswer(state) {
  		return state.answer
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
  	}
  }
})
