import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	query: '',
  	answer: '',
  	entity: '',
  	intent: '',
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

	  storeIntent: function(state, val) {
	  	state.intent = val
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

		setIntent({ commit }, val) {
	    commit('storeIntent', val)
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

  	getIntent(state) {
  		return state.intent
  	},

  	getIntroState(state) {
  		return state.introEnded
  	}
  }
})
