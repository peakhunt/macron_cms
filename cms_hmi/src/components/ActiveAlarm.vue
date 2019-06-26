<template>
<v-list-tile @click="onAlarmClick(alarm)">
  <v-list-tile-avatar>
    <v-icon large :color="alarmColor">error</v-icon>
  </v-list-tile-avatar>

  <v-list-tile-content>
    <v-list-tile-title> {{ alarm.alarmNum }} : {{ alarm.alarmCfg.name }}</v-list-tile-title>
    <v-list-tile-sub-title>{{ getAlarmStr(alarm.time) }}</v-list-tile-sub-title>
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
  methods: {
    getAlarmStr(ts) {
      return util.getAlarmTime(ts);
    },
    onAlarmClick() {
      this.$store.dispatch('alarmAck', { alarmNum: this.alarm.alarmNum });
    },
  },
};
</script>

<style>
</style>
