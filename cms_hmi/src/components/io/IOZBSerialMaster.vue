<template>
<v-card>
  <v-card-title>
    <h2>ZB Serial Master</h2>
  </v-card-title>
  <v-card-text>
    <v-container fluid grid-list-lg>
      <IOSerialCfg :serial="io.cfg.transport.serial"/>

      <v-layout row wrap>
        <v-flex xs12 v-for="(board, index) in io.cfg.boards" :key="index">
          <IOZBSerialSlave :board="board"/>
        </v-flex>
      </v-layout>

    </v-container>
  </v-card-text>
</v-card>
</template>

<script>
import IOZBSerialSlave from './IOZBSerialSlave.vue';
import IOSerialCfg from './IOSerialCfg.vue';

export default {
  name: 'IOZBSerialMaster',
  components: {
    IOZBSerialSlave,
    IOSerialCfg,
  },
  props: {
    io: { type: Object, default: null },
  },
};
</script>

<style>
</style>
