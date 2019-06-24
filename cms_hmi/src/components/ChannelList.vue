<template>
<v-container fluid grid-list-lg>
  <v-layout row wrap justify-center>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <h2>Channel List</h2>
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
         :items="channelList"
         :search="search"
        >
          <template v-slot:items="props">
            <td width="100px">{{props.item.chnlNum}}</td>
            <td width="100px" class="text-xs-left">{{props.item.chnlCfg.dir}}</td>
            <td width="100px" class="text-xs-left">{{props.item.chnlCfg.type}}</td>
            <td class="text-xs-left">{{props.item.chnlCfg.name}}</td>
            <td class="text-xs-left" width="180px">{{props.item.sensorFault}}</td>
            <td class="text-xs-left" width="180px">{{props.item.value}}</td>
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
  name: 'ChannelList',
  computed: {
    ...mapGetters([
      'channelList',
    ]),
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Number', align: 'left', value: 'chnlNum' },
        { text: 'Dir', align: 'left', value: 'chnlCfg.dir' },
        { text: 'Type', align: 'left', value: 'chnlCfg.type' },
        { text: 'Desc', align: 'left', value: 'chnlCfg.name' },
        { text: 'Sensor Fault', align: 'left', value: 'sensorFault' },
        { text: 'Value', align: 'left', value: 'value' },
      ],
      items: [],
      itemKey: 'chnl_num',
    };
  },
};
</script>

<style>
</style>
