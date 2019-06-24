<template>
<v-container fill-height>
  <v-layout align-center text-xs-center wrap>
    <v-flex xs12>
      <h1 class="display-2 font-weight-bold mb-3">Loading Project Config...</h1>
      <v-progress-circular :size="100" :width="10" color="green" indeterminate/>
    </v-flex>
  </v-layout>

  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">Loading Failed</v-card-title>
        <v-card-text>
          Failed to load project config from server.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="tryToLoadProjectConfig()">Retry</v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>

</v-container>
</template>

<script>
export default {
  name: 'ProjectLoader',
  mounted() {
    this.tryToLoadProjectConfig();
  },
  methods: {
    tryToLoadProjectConfig() {
      const self = this;

      self.dialog = false;

      setTimeout(() => {
        self.$store.dispatch('loadProjectConfig', (err) => {
          if (err === undefined) return;

          self.dialog = true;
        });
      }, 500);
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style>
</style>
