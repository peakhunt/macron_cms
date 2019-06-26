<template>
<v-list-tile @click="clickHandler">
  <v-list-tile-avatar>
    <v-icon large :color="alarmColor">{{alarmIcon}}</v-icon>
  </v-list-tile-avatar>

  <v-list-tile-content>
    <v-list-tile-title> {{ alarm.alarmNum }} : {{ alarm.alarmCfg.name }}</v-list-tile-title>
    <v-list-tile-sub-title>
      {{ getAlarmStr(alarm.time) }}
      -
      {{ alarm.alarmCfg.severity }}
    </v-list-tile-sub-title>
  </v-list-tile-content>
</v-list-tile>
</template>

<script>
import { mapGetters } from 'vuex';
import util from '../util';

export default {
  name: 'ActiveAlarm',
  props: {
    alarm: { type: Object, default: null },
  },
  computed: {
    ...mapGetters([
      'oneSecBlink',
      'halfSecBlink',
    ]),
    alarmIcon() {
      if (this.alarm.state === 3) {
        return 'check';
      }
      return 'error';
    },
    alarmColor() {
      let color;

      if (this.alarm.state === 3 || this.halfSecBlink === true) {
        color = util.alarmColors[this.alarm.alarmCfg.severity];
      } else {
        color = 'grey';
      }
      return color;
    },
  },
  data() {
    return {
      clickCount: 0,
      delay: 250,
      clickTimer: null,
    };
  },
  methods: {
    clickHandler(e) {
      e.preventDefault();
      this.clickCount += 1;

      if (this.clickCount === 1) {
        this.clickTimer = setTimeout(() => {
          this.clickCount = 0;
          // single-click
          this.$emit('alarm-info', this.alarm);
        }, this.delay);
      } else if (this.clickCount === 2) {
        clearTimeout(this.clickTimer);
        this.clickCount = 0;
        // 'double-click'
        this.onAlarmAck();
      }
    },
    getAlarmStr(ts) {
      return util.getAlarmTime(ts);
    },
    onAlarmAck() {
      this.$store.dispatch('alarmAck', { alarmNum: this.alarm.alarmNum });
    },
  },
};
</script>

<style>
</style>
