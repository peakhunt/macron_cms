<template>
<v-layout row wrap>
  <v-flex xs3>
    <v-text-field
     readonly
     label="Board Type"
     v-model="board.type"/>
  </v-flex>

  <v-flex xs3>
    <v-text-field
     readonly
     label="Address"
     v-model="board.address"/>
  </v-flex>

  <v-flex xs3>
    <v-text-field
     readonly
     label="Comm Fault"
     v-model="commFaultChannel.value"/>
  </v-flex>

  <v-flex xs3>
    <v-text-field
     readonly
     label="Timeout"
     v-model="board.timeout"/>
  </v-flex>
</v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'IOZBSerialSlave',
  computed: {
    ...mapGetters([
      'channelByNum',
    ]),
    commFaultChannel() {
      return this.channelByNum(this.board.commFault);
    },
  },
  props: {
    board: { type: Object, default: null },
  },
};
</script>

<style>
</style>
