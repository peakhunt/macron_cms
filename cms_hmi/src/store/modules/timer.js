let oneSecTmr = null;
let halfSecTmr = null;

const state = {
  oneSecBlink: false,
  halfSecBlink: false,
};

const mutations = {
  TIMER_RESET() {
    state.oneSecBlink = false;
    state.halfSecBlink = false;
  },
  ONE_SEC_TMR_FLIP() {
    if (state.oneSecBlink === true) {
      state.oneSecBlink = false;
    } else {
      state.oneSecBlink = true;
    }
  },
  HALF_SEC_TMR_FLIP() {
    if (state.halfSecBlink === true) {
      state.halfSecBlink = false;
    } else {
      state.halfSecBlink = true;
    }
  },
};

const actions = {
  timerServiceStart(context) {
    context.commit('TIMER_RESET');

    oneSecTmr = setInterval(() => {
      context.commit('ONE_SEC_TMR_FLIP');
    }, 1000);

    halfSecTmr = setInterval(() => {
      context.commit('HALF_SEC_TMR_FLIP');
    }, 500);
  },
  timerServiceStop() {
    if (oneSecTmr !== null) {
      clearInterval(oneSecTmr);
      oneSecTmr = null;
    }

    if (halfSecTmr !== null) {
      clearInterval(halfSecTmr);
      halfSecTmr = null;
    }
  },
};

const getters = {
  oneSecBlink() {
    return state.oneSecBlink;
  },
  halfSecBlink() {
    return state.halfSecBlink;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
