<template>
<v-card color="blue-grey darken-2" class="white--text">
  <v-card-title>
    <h2>{{tank.name}}</h2>
  </v-card-title>

  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- left column -->
      <v-flex d-flex xs5>
        <WidgetLinearGauge :chnl="levelAtFC.channel" :options="levelGaugeOption" />
      </v-flex>

      <!-- right column -->
      <v-flex d-flex xs7>
        <v-layout row wrap>
            <v-flex d-flex xs12 class="right-top">
              <WidgetRadialGauge :chnl="temperature.channel" :options="tempGaugeOption" />
            </v-flex>
            <v-flex d-flex xs12 class="right-bottom">
              <WidgetRadialGauge :chnl="pressure.channel" :options="pressureGaugeOption" />
            </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</v-card>
</template>

<script>
import WidgetLinearGauge from './widget/WidgetLinearGauge.vue';
import WidgetRadialGauge from './widget/WidgetRadialGauge.vue';

export default {
  name: 'Tank',
  components: {
    WidgetLinearGauge,
    WidgetRadialGauge,
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
    temperature() {
      return this.tank.temperature;
    },
    pressure() {
      return this.tank.pressure;
    },
    levelGaugeOption() {
      return {
        units: 'Meter',
        colorUnits: '#fff',
        title: 'Level at FC',
        colorTitle: '#fff',
        colorNumbers: '#fff',
        minValue: 0,
        maxValue: 320,
        width: 180,
        height: 410,
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
          0,
          40,
          80,
          120,
          160,
          200,
          240,
          280,
          320,
        ],
        colorPlate: 'transparent',
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
        fontTitleSize: 18,
        fontNumbersSize: 18,
        fontUnitsSize: 20,
        fontValueSize: 30,
        colorValueText: '#ffffff',
        colorValueBoxBackground: '#000000',
      };
    },
    tempGaugeOption() {
      return {
        units: '°C',
        colorUnits: '#fff',
        title: 'Temperature',
        colorTitle: '#fff',
        colorNumbers: '#fff',
        minValue: 0,
        maxValue: 320,
        width: 320,
        height: 200,
        strokeTicks: true,
        colorBar: 'transparent',
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
          },
          {
            from: 220,
            to: 320,
            color: '#FF3D00',
          },
        ],
        minorTicks: 10,
        majorTicks: [
          0,
          40,
          80,
          120,
          160,
          200,
          240,
          280,
          320,
        ],
        colorPlate: 'transparent',
        borderShadowWidth: 0,
        borders: false,
        needleType: 'arrow',
        needleShadow: true,
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        numberSide: 'left',
        needleSide: 'left',
        animationDuration: 25,
        animationRule: 'linear',
        barWidth: 0,
        valueBox: true,
        valueBoxStroke: 5,
        valueTextShadow: true,
        valueDec: 1,
        barBeginCircle: 0,
        fontTitleSize: 25,
        fontNumbersSize: 18,
        fontUnitsSize: 20,
        fontValueSize: 30,
        colorValueText: '#ffffff',
        colorValueBoxBackground: '#000000',
      };
    },
    pressureGaugeOption() {
      return {
        units: 'mBar',
        colorUnits: '#fff',
        title: 'Pressure',
        colorTitle: '#fff',
        colorNumbers: '#fff',
        minValue: 0,
        maxValue: 320,
        width: 320,
        height: 200,
        strokeTicks: true,
        barProgress: false,
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
          },
          {
            from: 220,
            to: 320,
            color: '#FF3D00',
          },
        ],
        minorTicks: 10,
        majorTicks: [
          0,
          40,
          80,
          120,
          160,
          200,
          240,
          280,
          320,
        ],
        colorPlate: 'transparent',
        borderShadowWidth: 0,
        borders: false,
        needleType: 'arrow',
        needleShadow: false,
        needleWidth: 0,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        numberSide: 'left',
        needleSide: 'left',
        animationDuration: 25,
        animationRule: 'linear',
        barWidth: 0,
        valueBox: true,
        valueBoxStroke: 5,
        valueTextShadow: true,
        valueDec: 1,
        barBeginCircle: 0,
        fontTitleSize: 25,
        fontNumbersSize: 18,
        fontUnitsSize: 20,
        fontValueSize: 30,
        colorValueText: '#ffffff',
        colorValueBoxBackground: '#000000',
      };
    },
  },
};
</script>

<style>
.right-top {
  height: 50%;
}
.right-bottom {
  height: 50%;
}
</style>
