<template>
<v-card>
  <v-card-title>
    <h2>Alarm {{alarmNum}}</h2>
  </v-card-title>
  <v-card-text>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
           readonly
           label="Alarm Number"
           v-model.number="alarmNum"
           type="number"/>
        </v-flex>
        <v-flex xs12>
          <v-text-field
           readonly
           label="Description"
           v-model="alarmName"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Severity"
           v-model="alarmSeverity"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Set Point"
           v-model="alarmSetpoint"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Delay"
           v-model="alarmDelay"/>
        </v-flex>
        <v-flex xs6>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Alarm State"
           v-model="alarmState"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Alarm Time"
           v-model="alarmTime"/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
</v-card>
</template>

<script>
import util from '../util';

export default {
  name: 'Alarm',
  props: {
    alarm: { type: Object, default: null },
  },
  computed: {
    alarmNum: {
      get() {
        return this.alarm === null ? 0 : this.alarm.alarmNum;
      },
    },
    alarmSeverity: {
      get() {
        return this.alarm === null ? '' : this.alarm.alarmCfg.severity;
      },
    },
    alarmSetpoint: {
      get() {
        return this.alarm === null ? '' : this.alarm.alarmCfg.set;
      },
    },
    alarmName: {
      get() {
        return this.alarm === null ? '' : this.alarm.alarmCfg.name;
      },
    },
    alarmDelay: {
      get() {
        return this.alarm === null ? '' : this.alarm.alarmCfg.delay;
      },
    },
    alarmState: {
      get() {
        return this.alarm === null ? '' : util.getAlarmStateStr(this.alarm.state);
      },
    },
    alarmTime: {
      get() {
        if (this.alarm === null) return '';

        return util.getAlarmTime(this.alarm.time);
      },
    },
  },
};
</script>

<style>
</style>
