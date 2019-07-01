<template>
<v-card>
  <v-card-title>
    <h2>IO RTU Master</h2>
  </v-card-title>
  <v-card-text>
    <v-container fluid grid-list-lg>
      <IOSerialCfg :serial="io.cfg.transport.serial"/>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Timeout"
           v-model="io.cfg.timeout"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Delay"
           v-model="io.cfg.delay"/>
        </v-flex>
      </v-layout>

      <IOSchedule v-for="(schedule, index) in io.cfg.schedules"
       :schedule="schedule"
       :key="'schedule' + index"
       />
    </v-container>
  </v-card-text>
</v-card>
</template>

<script>
import IOSerialCfg from './IOSerialCfg.vue';
import IOSchedule from './IOSchedule.vue';

export default {
  name: 'IORTUMaster',
  components: {
    IOSerialCfg,
    IOSchedule,
  },
  props: {
    io: { type: Object, default: null },
  },
};
</script>

<style>
</style>
