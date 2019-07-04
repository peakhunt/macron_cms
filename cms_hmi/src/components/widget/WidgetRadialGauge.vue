<template>
  <radial-gauge :value="value" :options="options"></radial-gauge>
</template>

<script>
import { mapGetters } from 'vuex';
import RadialGauge from 'vue2-canvas-gauges/src/RadialGauge.vue';

export default {
  name: 'WidgetRadialGauge',
  components: {
    RadialGauge,
  },
  computed: {
    ...mapGetters([
      'channelByNum',
    ]),
    value() {
      const chnl = this.channelByNum(this.chnl);

      return chnl.value;
    },
  },
  props: {
    chnl: { type: Number },
    options: { type: Object },
  },
};

</script>

<style>
</style>
