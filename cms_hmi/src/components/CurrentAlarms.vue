<template>
<v-list two-line>
  <template v-for="(item, index) in activeAlarmList">
    <ActiveAlarm :alarm="item"
     :key="item.alarmNum + item.alarmCfg.name"
     @alarm-info="onAlarmInfo"
    />
    <v-divider v-if="index < (activeAlarmList.length - 1)" inset :key="index"/>
  </template>

  <v-dialog v-model="alarmDialog.show" max-width="600px">
    <Alarm :alarm="alarmDialog.alarm" />
  </v-dialog>
</v-list>
</template>

<script>
import { mapGetters } from 'vuex';
import ActiveAlarm from './ActiveAlarm.vue';
import Alarm from './Alarm.vue';

export default {
  name: 'CurrentAlarms',
  components: {
    ActiveAlarm,
    Alarm,
  },
  computed: {
    ...mapGetters([
      'activeAlarmList',
    ]),
  },
  methods: {
    onAlarmInfo(alarm) {
      this.alarmDialog.alarm = alarm;
      this.alarmDialog.show = true;
    },
  },
  data() {
    return {
      alarmDialog: {
        show: false,
        alarm: null,
      },
    };
  },
};
</script>

<style>
</style>
