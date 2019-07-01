<template>
<v-layout row wrap>
  <v-flex xs6>
    <v-text-field
     readonly
     label="Port"
     v-model="serial.port"/>
  </v-flex>
  <v-flex xs6>
    <v-text-field
     readonly
     label="Baud Rate"
     v-model="serial.baud"/>
  </v-flex>
  <v-flex xs6>
    <v-text-field
     readonly
     label="Data Bit"
     v-model="serial.dataBit"/>
  </v-flex>
  <v-flex xs6>
    <v-text-field
     readonly
     label="Stop Bit"
     v-model="serial.stopBit"/>
  </v-flex>
  <v-flex xs6>
    <v-text-field
     readonly
     label="Parity"
     v-model="serial.parity"/>
  </v-flex>
</v-layout>
</template>

<script>
export default {
  name: 'IOSerialCfg',
  props: {
    serial: { type: Object, default: null },
  },
};
</script>

<style>
</style>
