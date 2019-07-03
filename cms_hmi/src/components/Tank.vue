<template>
<v-card color="blue-grey darken-2" class="white--text">
  <v-card-title>
    <h2>{{tank.name}}</h2>
  </v-card-title>

  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <WidgetLinearGauge :chnl="levelAtFC.channel" :options="linearGraphOption" />
      </v-flex>
    </v-layout>
  </v-container>
</v-card>
</template>

<script>
import WidgetLinearGauge from './widget/WidgetLinearGauge.vue';

export default {
  name: 'Tank',
  components: {
    WidgetLinearGauge,
  },
  props: {
    tank: { type: Object, default: null },
  },
  computed: {
    ullageAtRefCfg() {
      return this.tank.level.ullageAtRef;
    },
    levelAtRef() {
      return this.tank.level.levelAtRef;
    },
    ullageAtFC() {
      return this.tank.level.ullageAtFC;
    },
    levelAtFC() {
      return this.tank.level.levelAtFC;
    },
    linearGraphOption() {
      return {
        units: 'Meter',
        title: 'Level at FC',
        minValue: 0,
        maxValue: 320,
        width: 130,
        height: 360,
        strokeTicks: true,
        colorBar: 'white',
        colorBarProgress: 'blue',
        highlights: [
          {
            from: 0,
            to: 100,
            color: '#00E676',
          },
          {
            from: 100,
            to: 220,
            color: '#FFFF8D',
          }, {
            from: 220,
            to: 320,
            color: '#FF3D00',
          },
        ],
        minorTicks: 10,
        majorTicks: [
          '0',
          '40',
          '80',
          '120',
          '160',
          '200',
          '240',
          '280',
          '320',
        ],
        colorPlate: '#fff',
        borderShadowWidth: 0,
        borders: false,
        needleType: 'arrow',
        needleShadow: true,
        needleWidth: 0,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        numberSide: 'left',
        needleSide: 'left',
        animationDuration: 25,
        animationRule: 'linear',
        barWidth: 15,
        valueBox: true,
        valueBoxStroke: 5,
        valueTextShadow: true,
        valueDec: 1,
        barBeginCircle: 0,
        fontNumbersSize: 28,
        fontUnitsSize: 30,
        fontValueSize: 30,
        colorValueText: '#ffffff',
        colorValueBoxBackground: '#000000',
      };
    },
  },
};
</script>

<style>
</style>
