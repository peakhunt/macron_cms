<template>
  <linear-gauge :value="value" :options="options"></linear-gauge>
</template>

<script>
import { mapGetters } from 'vuex';
import LinearGauge from 'vue2-canvas-gauges/src/LinearGauge.vue';

export default {
  name: 'WidgetLinearGauge',
  components: {
    LinearGauge,
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
