<template>
<v-list two-line>
  <template v-for="(item, index) in activeAlarmList">
    <ActiveAlarm :alarm="item" :key="item.alarmNum + item.alarmCfg.name"/>
    <v-divider v-if="index < (activeAlarmList.length - 1)" inset :key="index"/>
  </template>
</v-list>
</template>

<script>
import { mapGetters } from 'vuex';
import ActiveAlarm from './ActiveAlarm.vue';

export default {
  name: 'CurrentAlarms',
  components: {
    ActiveAlarm,
  },
  computed: {
    ...mapGetters([
      'activeAlarmList',
    ]),
  },
};
</script>

<style>
</style>
