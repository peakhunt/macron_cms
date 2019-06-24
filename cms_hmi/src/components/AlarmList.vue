<template>
<v-container fluid grid-list-lg>
  <v-layout row wrap justify-center>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <h2>Alarm List</h2>
          <v-spacer></v-spacer>
          <v-text-field
           append-icon="search"
           label="Search"
           single-line
           hide-details
           v-model="search">
          </v-text-field>
        </v-card-title>

        <v-data-table
         class="elevation-1"
         :headers="headers"
         :items="alarmList"
         :search="search"
        >
          <template v-slot:items="props">
            <td width="100px">{{props.item.alarmNum}}</td>
            <td width="100px" class="text-xs-left">{{props.item.alarmCfg.severity}}</td>
            <td width="100px" class="text-xs-left">{{props.item.alarmCfg.set}}</td>
            <td width="100px" class="text-xs-left">{{props.item.alarmCfg.delay}}</td>
            <td class="text-xs-left">{{props.item.alarmCfg.name}}</td>
            <td class="text-xs-left" width="180px">{{props.item.time}}</td>
            <td class="text-xs-left" width="180px">{{props.item.state}}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AlarmList',
  computed: {
    ...mapGetters([
      'alarmList',
    ]),
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Number', align: 'left', value: 'alarmNum' },
        { text: 'Severity', align: 'left', value: 'alarmCfg.severity' },
        { text: 'Set', align: 'left', value: 'alarmCfg.set' },
        { text: 'Delay', align: 'left', value: 'alarmCfg.delay' },
        { text: 'Name', align: 'left', value: 'alarmCfg.name' },
        { text: 'Time', align: 'left', value: 'time' },
        { text: 'State', align: 'left', value: 'state' },
      ],
      items: [],
      itemKey: 'chnl_num',
    };
  },
};
</script>

<style>
</style>
