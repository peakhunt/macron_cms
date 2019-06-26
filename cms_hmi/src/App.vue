<template>
  <v-app>
    <v-toolbar app v-if="projectConfigLoaded">
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <span>
        {{numUnackedAlarms}}
        /
        {{numActiveAlarms}}
      </span>

      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view v-if="projectConfigLoaded"></router-view>
      <ProjectLoader v-if="!projectConfigLoaded"/>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import ProjectLoader from './components/ProjectLoader.vue';

export default {
  name: 'App',
  components: {
    ProjectLoader,
  },
  computed: {
    ...mapGetters([
      'projectConfig',
      'projectConfigLoaded',
      'projectConfigLoading',
      'numActiveAlarms',
      'numUnackedAlarms',
    ]),
  },
  data() {
    return {
      //
    };
  },
};
</script>
