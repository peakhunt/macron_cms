<template>
<v-container>
  <v-layout text-xs-center wrap>
    <v-flex xs12>
      <h1 class="display-2 font-weight-bold mb-3">Loading Project Config</h1>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  name: 'ProjectLoader',
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('loadProjectConfig', () => {});
    }, 1000);
  },
};
</script>

<style>
</style>
