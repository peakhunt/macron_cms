<template>
  <radial-gauge :value="value" :options="options"></radial-gauge>
</template>

<script>
import { mapGetters } from 'vuex';
import RadialGauge from 'vue2-canvas-gauges/src/RadialGauge.vue';
import WidgetCommon from './WidgetCommon.vue';

export default {
  name: 'WidgetRadialGauge',
  mixins: [WidgetCommon],
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
  methods: {
    updateAlarmColor() {
      const c = this.alarmColor;
      this.$children[0].chart.update(c);
    },
  },
  props: {
    chnl: { type: Number },
  },
};

</script>

<style>
</style>
