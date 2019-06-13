// import Vue from 'vue';
import axios from 'axios';

const state = {
  projectConfig: {
  },
};

const mutations = {
  PROJECT_CONFIG_SET(_, config) {
    state.projectConfig = config;
  },
};

const actions = {
  loadProjectConfig(context, cb) {
    axios.get('/api/public/config').then((response) => {
      context.commit('PROJECT_CONFIG_SET', response.data);
      cb(undefined, response.data);
    }, (err) => {
      cb(err);
    });
  },
};

const getters = {
  projectConfig() {
    return state.projectConfig;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
