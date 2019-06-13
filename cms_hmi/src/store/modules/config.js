// import Vue from 'vue';
import axios from 'axios';

const state = {
  projectConfig: {
  },
  projectConfigLoaded: false,
  projectConfigLoading: false,
};

const mutations = {
  PROJECT_CONFIG_LOADED_SET(_, v) {
    state.projectConfigLoaded = v;
  },
  PROJECT_CONFIG_LOADING_SET(_, v) {
    state.projectConfigLoading = v;
  },
  PROJECT_CONFIG_SET(_, config) {
    state.projectConfig = config;
  },
};

const actions = {
  loadProjectConfig(context, cb) {
    context.commit('PROJECT_CONFIG_LOADING_SET', true);

    axios.get('/api/public/config').then((response) => {
      context.commit('PROJECT_CONFIG_SET', response.data);
      context.commit('PROJECT_CONFIG_LOADING_SET', false);
      context.commit('PROJECT_CONFIG_LOADED_SET', true);
      cb(undefined, response.data);
    }, (err) => {
      context.commit('PROJECT_CONFIG_LOADING_SET', false);
      context.commit('PROJECT_CONFIG_LOADED_SET', false);
      cb(err);
    });
  },
};

const getters = {
  projectConfig() {
    return state.projectConfig;
  },
  projectConfigLoaded() {
    return state.projectConfigLoaded;
  },
  projectConfigLoading() {
    return state.projectConfigLoading;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
