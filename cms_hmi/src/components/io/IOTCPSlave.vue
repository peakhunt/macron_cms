<template>
<v-card>
  <v-card-title>
    <h2>IO TCP Slave</h2>
  </v-card-title>
  <v-card-text>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Host"
           v-model="io.cfg.transport.net.host"/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
           readonly
           label="Port"
           v-model="io.cfg.transport.net.port"/>
        </v-flex>

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
export default {
  name: 'IOTCPSlave',
  props: {
    io: { type: Object, default: null },
  },
};
</script>

<style>
</style>
