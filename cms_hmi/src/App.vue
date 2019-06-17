<template>
  <v-app>
    <v-toolbar app v-if="projectConfigLoaded">
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <HelloWorld v-if="projectConfigLoaded"/>
      <ProjectLoader v-if="!projectConfigLoaded"/>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import HelloWorld from './components/HelloWorld.vue';
import ProjectLoader from './components/ProjectLoader.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    ProjectLoader,
  },
  computed: {
    ...mapGetters([
      'projectConfig',
      'projectConfigLoaded',
      'projectConfigLoading',
    ]),
  },
  data() {
    return {
      //
    };
  },
};
</script>
