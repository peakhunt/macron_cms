const state = {
  ioSerial: [],
  ioNet: [],
};

const mutations = {
  IO_INIT(_, ioConfig) {
    state.ioSerial = [];
    state.ioNet = [];

    Object.keys(ioConfig).forEach((ioType) => {
      if (ioType === 'serial') {
        const serialCfgs = ioConfig[ioType];

        serialCfgs.forEach((sCfg) => {
          state.ioSerial.push({
            cfg: sCfg,
            // FIXME runtime data
          });
        });
      } else if (ioType === 'net') {
        const netCfgs = ioConfig[ioType];

        netCfgs.forEach((nCfg) => {
          state.ioNet.push({
            cfg: nCfg,
            // FIXME runtime data
          });
        });
      }
    });
  },
};

const actions = {
  ioInit(context, ioConfig) {
    context.commit('IO_INIT', ioConfig);
  },
};

const getters = {
  ioSerial() {
    return state.ioSerial;
  },
  ioNet() {
    return state.ioNet;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
