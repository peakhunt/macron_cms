import Vue from 'vue';
import axios from 'axios';

const state = {
  alarms: {
  },
  alarmList: [],
};

let alarmPollTmr = null;
let alarmPollNdx = 0;

const mutations = {
  ALARMS_INIT(_, alarmsConfig) {
    state.alarms = {};
    state.alarmList = [];

    Object.keys(alarmsConfig).forEach((alarmNum) => {
      const alarmCfg = alarmsConfig[alarmNum];
      const alarm = {
        alarmNum: parseInt(alarmNum, 10),
        alarmCfg,
        state: 0,
        time: 0,
      };
      Vue.set(state.alarms, alarmNum, alarm);
      state.alarmList.push(alarm);
    });
  },
  ALARMS_UPDATE(_, alarmUpdates) {
    Object.keys(alarmUpdates).forEach((alarmNum) => {
      const salarm = state.alarms[alarmNum];
      const ualarm = alarmUpdates[alarmNum];

      salarm.state = ualarm.state;
      salarm.time = ualarm.time;
    });
  },
};

const actions = {
  alarmsInit(context, alarmsConfig) {
    context.commit('ALARMS_INIT', alarmsConfig);
  },
  alarmsPollStart(context) {
    const { web } = context.rootState.config.projectConfig.project;
    const { poll, numPerPoll } = web.alarms;

    if (alarmPollTmr !== null) {
      return;
    }

    function pollAlarms() {
      let endNdx = alarmPollNdx + numPerPoll - 1;

      if (endNdx >= state.alarmList.length) {
        endNdx = state.alarmList.length - 1;
      }

      const start = state.alarmList[alarmPollNdx].alarmNum;
      const end = state.alarmList[endNdx].alarmNum;

      alarmPollNdx = endNdx + 1;
      if (alarmPollNdx >= state.alarmList.length) {
        alarmPollNdx = 0;
      }

      const url = `/api/public/alarmRange/${start}/${end}`;

      axios.get(url).then((response) => {
        context.commit('ALARMS_UPDATE', response.data);
        alarmPollTmr = setTimeout(() => { pollAlarms(); }, poll);
      }, (err) => {
        console.log(`failed to get ${url} ${err}`);
        alarmPollTmr = setTimeout(() => { pollAlarms(); }, poll);
      });
    }

    alarmPollTmr = setTimeout(() => { pollAlarms(); }, poll);
  },
  alarmsPollStop() {
    if (alarmPollTmr === null) {
      return;
    }

    clearTimeout(alarmPollTmr);
  },
  alarmAck(context, alarmNum, cb) {
    const url = `/api/public/alarm_ack/${alarmNum}`;

    axios.get(url).then((response) => {
      const update = {
      };

      update[alarmNum] = response.data;

      context.commit('ALARMS_UPDATE', update);

      if (cb !== undefined) {
        cb(undefined, response.data);
      }
    }, (err) => {
      console.log(`failed to get ${url} ${err}`);
      if (!cb !== undefined) {
        cb(err);
      }
    });
  },
};

const getters = {
  alarms() {
    return state.alarms;
  },
  alarmList() {
    return state.alarmList;
  },
  alarmByNum: () => alarmNum => state.alarms[alarmNum],
};

export default {
  state,
  mutations,
  actions,
  getters,
};
