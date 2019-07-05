<script>
import { mapGetters } from 'vuex';
import util from '../../util';

export default {
  name: 'WidgetCommon',
  props: {
    alarms: { type: Array, default: null },
    options: { type: Object },
  },
  computed: {
    ...mapGetters([
      'alarmByNum',
      'halfSecBlink',
    ]),
    alarmState() {
      let severity = 'normal';
      let s = 0;

      if (this.alarms === null) {
        return { severity, state: s };
      }

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
  watch: {
    alarmColor() {
      this.updateAlarmColor();
    },
  },
  methods: {
    invokeUpdate() {
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
