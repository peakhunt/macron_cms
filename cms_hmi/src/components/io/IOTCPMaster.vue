<template>
<v-card>
  <v-card-title>
    <h2>IO TCP Master</h2>
  </v-card-title>
  <v-card-text>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Target Host"
           v-model="io.cfg.target.host"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           readonly
           label="Target Port"
           v-model="io.cfg.target.port"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           readonly
           label="Delay"
           v-model="io.cfg.delay"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           readonly
           label="Reconnect Timer"
           v-model="io.cfg.reconnectTmr"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           readonly
           label="Timeout"
           v-model="io.cfg.timeout"/>
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
import IOSchedule from './IOSchedule.vue';

export default {
  name: 'IOTCPMaster',
  components: {
    IOSchedule,
  },
  props: {
    io: { type: Object, default: null },
  },
};
</script>

<style>
</style>
