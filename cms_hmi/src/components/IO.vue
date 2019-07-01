<template>
<v-container fluid grid-list-lg>
  <v-layout row wrap>
    <v-flex xs12 v-for="(ioS, index) in ioSerial" :key="'ioSerial' + index">
      <IOZBSerialMaster :io="ioS" v-if="ioS.cfg.type === 'zbSerialMaster'"/>
      <IORTUSlave :io="ioS" v-if="ioS.cfg.type === 'modbusRTUSlave'"/>
      <IORTUMaster :io="ioS" v-if="ioS.cfg.type === 'modbusRTUMaster'"/>
    </v-flex>

    <v-flex xs12 v-for="(ioN, index) in ioNet" :key="'ioNet' + index">
      <IOTCPSlave :io="ioN" v-if="ioN.cfg.type === 'modbusTCPSlave'"/>
      <IOTCPMaster :io="ioN" v-if="ioN.cfg.type === 'modbusTCPMaster'"/>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import IOZBSerialMaster from './io/IOZBSerialMaster.vue';
import IORTUSlave from './io/IORTUSlave.vue';
import IORTUMaster from './io/IORTUMaster.vue';
import IOTCPSlave from './io/IOTCPSlave.vue';
import IOTCPMaster from './io/IOTCPMaster.vue';

export default {
  name: 'IO',
  components: {
    IOZBSerialMaster,
    IORTUSlave,
    IORTUMaster,
    IOTCPSlave,
    IOTCPMaster,
  },
  computed: {
    ...mapGetters([
      'ioSerial',
      'ioNet',
    ]),
  },
};
</script>

<style>
</style>
