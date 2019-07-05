<template>
  <linear-gauge :value="value" :options="options"></linear-gauge>
</template>

<script>
import { mapGetters } from 'vuex';
import LinearGauge from 'vue2-canvas-gauges/src/LinearGauge.vue';
import WidgetCommon from './WidgetCommon.vue';

export default {
  name: 'WidgetLinearGauge',
  mixins: [WidgetCommon],
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
