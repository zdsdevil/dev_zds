import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import chat from './modules/chat'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    chat
  },
  state: {
    showPageLoadScrollBar: false
  },
  mutations: {
    setShowPageLoadScrollBar (state, data) {
      state.showPageLoadScrollBar = !!data
    }
  },
  actions: {},
  getters
})
