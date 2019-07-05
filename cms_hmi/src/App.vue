<template>
  <v-app>
    <v-navigation-drawer
     fixed
     :mini-variant="miniVariant"
     :clipped="clipped"
     v-model="drawer"
     app
    >
      <v-list>
        <v-list-tile
         router
         :to="item.to"
         :key="i"
         v-for="(item, i) in items"
         exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app v-if="projectConfigLoaded" :clipped-left="clipped">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
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
      miniVariant: false,
      clipped: true,
      drawer: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'apps', title: 'Channel List', to: '/ChannelList' },
        { icon: 'apps', title: 'Alarm List', to: '/AlarmList' },
        { icon: 'apps', title: 'IO', to: '/IO' },
        { icon: 'apps', title: 'Current Alarms', to: '/CurrentAlarms' },
        { icon: 'apps', title: 'Tanks', to: '/TankList' },
        { icon: 'apps', title: 'Vessel', to: '/Vessel' },
      ],
    };
  },
};
</script>
