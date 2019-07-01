<template>
<v-card>
  <v-card-title>
    <h2>ZB Serial Master</h2>
  </v-card-title>
  <v-card-text>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Port"
           v-model="io.cfg.transport.serial.port"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Baud Rate"
           v-model="io.cfg.transport.serial.baud"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Data Bit"
           v-model="io.cfg.transport.serial.dataBit"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Stop Bit"
           v-model="io.cfg.transport.serial.stopBit"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Parity"
           v-model="io.cfg.transport.serial.parity"/>
        </v-flex>
      </v-layout>

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

export default {
  name: 'IOZBSerialMaster',
  components: {
    IOZBSerialSlave,
  },
  props: {
    io: { type: Object, default: null },
  },
};
</script>

<style>
</style>
