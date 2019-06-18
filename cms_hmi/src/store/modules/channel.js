import Vue from 'vue';
import axios from 'axios';

const state = {
  channels: {
  },
  channelList: [],
};

let chnlPollTmr = null;
let chnlPollNdx = 0;

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
    const { poll, numPerPoll } = web.channels;

    if (chnlPollTmr !== null) {
      return;
    }

    function pollChannels() {
      let endNdx = chnlPollNdx + numPerPoll - 1;

      if (endNdx >= state.channelList.length) {
        endNdx = state.channelList.length - 1;
      }

      const start = state.channelList[chnlPollNdx].chnlNum;
      const end = state.channelList[endNdx].chnlNum;

      chnlPollNdx = endNdx + 1;
      if (chnlPollNdx >= state.channelList.length) {
        chnlPollNdx = 0;
      }

      const url = `/api/public/channelRange/${start}/${end}`;


      axios.get(url).then((response) => {
        context.commit('CHANNELS_UPDATE', response.data);
        chnlPollTmr = setTimeout(() => { pollChannels(); }, poll);
      }, (err) => {
        console.log(`failed to get ${url} ${err}`);
        chnlPollTmr = setTimeout(() => { pollChannels(); }, poll);
      });
    }

    chnlPollTmr = setTimeout(() => { pollChannels(); }, poll);
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
