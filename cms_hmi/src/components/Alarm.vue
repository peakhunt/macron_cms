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
           label="Delay"
           v-model="alarmDelay"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           readonly
           label="Set Point"
           v-model="alarmSetpoint"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           v-if="alarmType !== ''"
           readonly
           label="Alarm Type"
           v-model="alarmType"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           readonly
           label="Channel"
           v-model="channelNumber"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           readonly
           label="Channel Value"
           v-model="channelValue"/>
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
import { mapGetters } from 'vuex';
import util from '../util';

export default {
  name: 'Alarm',
  props: {
    alarm: { type: Object, default: null },
  },
  computed: {
    ...mapGetters([
      'channelByNum',
    ]),
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
    alarmType: {
      get() {
        if (this.alarm === null || this.alarm.alarmCfg.type === undefined) {
          return '';
        }

        return this.alarm.alarmCfg.type;
      },
    },
    channelNumber: {
      get() {
        return this.alarm === null ? '' : this.alarm.alarmCfg.channel;
      },
    },
    channelValue: {
      get() {
        if (this.alarm === null) return 0;

        return this.channelByNum(this.alarm.alarmCfg.channel).value;
      },
    },
  },
};
</script>

<style>
</style>
