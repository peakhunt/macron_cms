<template>
  <v-list two-line subheader>
    <v-list-tile
     v-for="item in activeAlarmList"
     :key="item.alarmNum"
    >
      <v-list-tile-avatar>
        <v-icon >folder</v-icon>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title> {{ item.alarmNum }} : {{ item.alarmCfg.name }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ getAlarmStr(item.time) }}</v-list-tile-sub-title>
      </v-list-tile-content>

      <v-list-tile-action>
        <v-btn icon ripple>
          <v-icon color="grey lighten-1">info</v-icon>
        </v-btn>
      </v-list-tile-action>

    </v-list-tile>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex';
import util from '../util';

export default {
  name: 'CurrentAlarms',
  computed: {
    ...mapGetters([
      'activeAlarmList',
    ]),
  },
  methods: {
    getAlarmStr(ts) {
      return util.getAlarmTime(ts);
    },
  },
};
</script>

<style>
</style>
