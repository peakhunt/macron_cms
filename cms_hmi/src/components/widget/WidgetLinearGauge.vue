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
      let s = 0;

      this.alarms.forEach((alarmNum) => {
        const alarm = this.alarmByNum(alarmNum);

        if (alarm.state === 0) {
          // normal
          return;
        }

        // alarm state
        // get highest alarm severity
        severity = util.getBiggerAlarmSeverity(severity, alarm.alarmCfg.severity);
        s = alarm.state;
      });

      return {
        severity,
        state: s,
      };
    },
    alarmColor() {
      const s = this.alarmState;

      if (s.severity === 'normal') {
        return {
          colorValueText: util.alarmTextColor.normal.text,
          colorValueBoxBackground: util.alarmTextColor.normal.back,
        };
      }

      if (s.state === 3) {
        // acked. steady color
        return {
          colorValueText: util.alarmTextColor[s.severity].text,
          colorValueBoxBackground: util.alarmTextColor[s.severity].back,
        };
      }

      // not acked. blinking color
      if (this.halfSecBlink === true) {
        return {
          colorValueText: util.alarmTextColor.normal.text,
          colorValueBoxBackground: util.alarmTextColor.normal.back,
        };
      }

      return {
        colorValueText: util.alarmTextColor[s.severity].text,
        colorValueBoxBackground: util.alarmTextColor[s.severity].back,
      };
    },
  },
  methods: {
    updateAlarmColor() {
      const c = this.alarmColor;
      this.$children[0].chart.update(c);
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
  mounted() {
    const self = this;

    self.updateAlarmColor();
    /*
    self.$nextTick(() => {
      self.updateAlarmColor();
    });
    */
  },
};
</script>

<style>
</style>
