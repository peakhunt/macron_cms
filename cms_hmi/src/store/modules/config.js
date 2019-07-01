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
    context.dispatch('alarmsPollStop');
    context.dispatch('channelsPollStop');
    context.dispatch('timerServiceStop');

    axios.get('/api/public/config').then((response) => {
      const config = response.data;

      context.commit('PROJECT_CONFIG_SET', config);

      context.dispatch('channelsInit', config.project.channels);
      context.dispatch('alarmsInit', config.project.alarms);
      context.dispatch('ioInit', config.project.io);

      context.commit('PROJECT_CONFIG_LOADING_SET', false);
      context.commit('PROJECT_CONFIG_LOADED_SET', true);

      context.dispatch('alarmsPollStart');
      context.dispatch('channelsPollStart');
      context.dispatch('timerServiceStart');
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
