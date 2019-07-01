<template>
<v-card>
  <v-card-title>
    <h2>IO RTU Slave</h2>
  </v-card-title>
  <v-card-text>
    <v-container fluid grid-list-lg>
      <IOSerialCfg :serial="io.cfg.transport.serial"/>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Address"
           v-model="io.cfg.address"/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
</v-card>
</template>

<script>
import IOSerialCfg from './IOSerialCfg.vue';

export default {
  name: 'IORTUSlave',
  components: {
    IOSerialCfg,
  },
  props: {
    io: { type: Object, default: null },
  },
};
</script>

<style>
</style>
