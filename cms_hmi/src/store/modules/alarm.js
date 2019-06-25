import Vue from 'vue';
import axios from 'axios';

const state = {
  alarms: {
  },
  alarmList: [],
  activeAlarmsHash: {
  },
  activeAlarmList: [],
};

function udpateActiveAlarms(alarm) {
  let n;

  if (alarm.state === 0) {
    // alarm clear or no alarm at all
    if (state.activeAlarmsHash[alarm.alarmNum] !== undefined) {
      // delete alarm from active alarms
      n = state.activeAlarmList[alarm];

      delete state.activeAlarmsHash[alarm.alarmNum];
      state.activeAlarmList.splice(n, 1);
    }
  } else {
    // alarm occur
    if (state.activeAlarmsHash[alarm.alarmNum] !== undefined) return;

    state.activeAlarmsHash[alarm.alarmNum] = alarm;

    // sort activeAlarmList by time
    for (n = 0; n < state.activeAlarmList.length; n += 1) {
      if (alarm.time > state.activeAlarmList[n].time) {
        break;
      }
    }
    state.activeAlarmList.splice(n, 0, alarm);
  }
}

let alarmPollTmr = null;
let alarmPollNdx = 0;

const mutations = {
  ALARMS_INIT(_, alarmsConfig) {
    state.alarms = {};
    state.alarmList = [];
    state.activeAlarmsHash = {};
    state.activeAlarmList = [];

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

      udpateActiveAlarms(salarm);
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
  activeAlarmList() {
    return state.activeAlarmList;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
