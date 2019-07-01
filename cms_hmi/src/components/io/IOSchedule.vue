<template>
<v-layout row wrap>
  <v-flex xs2>
    <v-text-field
     readonly
     label="Slave"
     v-model="schedule.slave"/>
  </v-flex>

  <v-flex xs2>
    <v-text-field
     readonly
     label="Function"
     v-model="schedule.func"/>
  </v-flex>

  <v-flex xs3>
    <v-text-field
     readonly
     label="Register"
     v-model="schedule.register"/>
  </v-flex>

  <v-flex xs3>
    <v-text-field
     readonly
     label="Address"
     v-model="schedule.addr"/>
  </v-flex>

  <v-flex xs2>
    <v-text-field
     readonly
     label="Num Registers"
     v-model="schedule.numRegs"/>
  </v-flex>
</v-layout>
</template>

<script>
export default {
  name: 'IOSchedule',
  props: {
    schedule: { type: Object, default: null },
  },
};
</script>

<style>
</style>
