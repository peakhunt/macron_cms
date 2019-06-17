import Vue from 'vue';
import axios from 'axios';

const state = {
  channels: {
  },
  channelList: [],
};

let chnlPollTmr = null;

const mutations = {
  CHANNELS_INIT(_, chnlsConfig) {
    state.channels = {};
    state.channelList = [];

    Object.keys(chnlsConfig).forEach((chnlNum) => {
      const chnlCfg = chnlsConfig[chnlNum];
      const channel = {
        chnlNum: parseInt(chnlNum, 10),
        chnlCfg,
        value: 0,
        sensorFault: false,
      };
      Vue.set(state.channels, chnlNum, channel);
      state.channelList.push(channel);
    });
  },
  CHANNELS_UPDATE(_, chnlsUpdates) {
    Object.keys(chnlsUpdates).forEach((chnlNum) => {
      const schnl = state.channels[chnlNum];
      const uchnl = chnlsUpdates[chnlNum];

      schnl.value = uchnl.value;
      schnl.sensorFault = uchnl.sensorFault;
    });
  },
};

const actions = {
  channelsInit(context, chnlsConfig) {
    context.commit('CHANNELS_INIT', chnlsConfig);
  },
  channelsPollStart(context) {
    const { web } = context.rootState.config.projectConfig.project;

    if (chnlPollTmr !== null) {
      return;
    }

    function pollChannels() {
      const start = state.channelList[0].chnlNum;
      const end = state.channelList[state.channelList.length - 1].chnlNum;

      const url = `/api/public/channelRange/${start}/${end}`;

      axios.get(url).then((response) => {
        context.commit('CHANNELS_UPDATE', response.data);
        chnlPollTmr = setTimeout(() => { pollChannels(); }, web.channels.poll);
      }, (err) => {
        console.log(`failed to get ${url} ${err}`);
        chnlPollTmr = setTimeout(() => { pollChannels(); }, web.channels.poll);
      });
    }

    chnlPollTmr = setTimeout(() => { pollChannels(); }, web.channels.poll);
  },
  channelsPollStop() {
    if (chnlPollTmr === null) {
      return;
    }

    clearTimeout(chnlPollTmr);
  },
};

const getters = {
  channels() {
    return state.channels;
  },
  channelList() {
    return state.channelList;
  },
  channelByNum: () => chnlNum => state.channels[chnlNum],
};

export default {
  state,
  mutations,
  actions,
  getters,
};
