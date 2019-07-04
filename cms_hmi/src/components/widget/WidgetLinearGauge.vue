<template>
  <linear-gauge :value="value" :options="options"></linear-gauge>
</template>

<script>
import { mapGetters } from 'vuex';
import LinearGauge from 'vue2-canvas-gauges/src/LinearGauge.vue';
import util from '../../util';

export default {
  name: 'WidgetLinearGauge',
  components: {
    LinearGauge,
  },
  computed: {
    ...mapGetters([
      'channelByNum',
      'alarmByNum',
      'halfSecBlink',
    ]),
    value() {
      const chnl = this.channelByNum(this.chnl);

      return chnl.value;
    },
    alarmState() {
      let severity = 'normal';

      this.alarms.forEach((alarmNum) => {
        const alarm = this.alarmByNum(alarmNum);

        if (alarm.state === 0) {
          // normal
          return;
        }

        // alarm state
        // get highest alarm severity
        severity = util.getBiggerAlarmSeverity(severity, alarm.alarmCfg.severity);
      });

      return severity;
    },
    alarmColor() {
      const severity = this.alarmState;

      if (severity === 'normal') {
        return {
          colorValueText: util.alarmTextColor.normal.text,
          colorValueBoxBackground: util.alarmTextColor.normal.back,
        };
      }

      if (this.halfSecBlink === true) {
        return {
          colorValueText: util.alarmTextColor.normal.text,
          colorValueBoxBackground: util.alarmTextColor.normal.back,
        };
      }

      return {
        colorValueText: util.alarmTextColor[severity].text,
        colorValueBoxBackground: util.alarmTextColor[severity].back,
      };
    },
  },
  methods: {
    updateAlarmColor() {
      const c = this.getAlarmColor();
      const obj = {
        colorValueText: c.textColor,
        colorValueBoxBackground: c.backgroundColor,
      };
      this.$children[0].chart.update(obj);
    },
  },
  props: {
    chnl: { type: Number },
    alarms: { type: Array, default: null },
    options: { type: Object },
  },
  watch: {
    alarmColor(c) {
      this.$children[0].chart.update(c);
    },
  },
};
</script>

<style>
</style>
