<template>
<v-container fluid grid-list-lg>
  <v-layout row wrap>
    <v-flex xs12 md6 lg6 v-for="(tank, index) in tanks" :key="'tl1' + index">
      <Tank :tank="tank"/>
    </v-flex>
    <v-flex xs12 md6 lg6 v-for="(tank, index) in tanks" :key="'tl2' + index">
      <Tank :tank="tank"/>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Tank from './Tank.vue';

export default {
  name: 'TankList',
  components: {
    Tank,
  },
  computed: {
    ...mapGetters([
      'tanks',
    ]),
  },
};
</script>

<style>
</style>
