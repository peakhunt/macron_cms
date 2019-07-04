<template>
<v-card color="blue-grey darken-2" class="white--text">
  <v-card-title>
    <h2>{{tank.name}}</h2>
  </v-card-title>

  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- left column -->
      <v-flex d-flex xs12 md5 lg5>
        <v-layout row wrap>
          <v-flex d-flex xs12>
            <WidgetLinearGauge :chnl="levelCfg.channel" :alarms="levelCfg.alarms"
             :options="levelGaugeOpt" />
          </v-flex>
          <v-flex d-flex>
            <v-btn flat icon color="white" @click="onLevelLeftClick">
              <v-icon>arrow_back_ios</v-icon>
            </v-btn>
            <v-btn flat icon color="white" @click="onLevelRightClick">
              <v-icon>arrow_forward_ios</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>

      <!-- right column -->
      <v-flex d-flex xs12 md7 lg7>
        <v-layout row wrap>
            <v-flex d-flex xs12>
              <WidgetRadialGauge :chnl="temperature.channel" :options="tempGaugeOpt" />
            </v-flex>
            <v-flex d-flex xs12>
              <WidgetRadialGauge :chnl="pressure.channel" :options="pressureGaugeOpt" />
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
import util from '../util';

const levelNames = [
  'Ullage at Ref',
  'Level at Ref',
  'Ullage at FC',
  'Level at FC',
];

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
    levelCfg() {
      switch (this.levelNdx) {
        case 0:
          return this.ullageAtRefCfg;
        case 1:
          return this.levelAtRef;
        case 2:
          return this.ullageAtFC;
        default:
          return this.levelAtFC;
      }
    },
    levelGaugeOpt() {
      const defLinearGateOpt = {
        unit: 'Meter',
        title: 'Level At FC',
        min: 0,
        max: 320,
        width: 180,
        height: 410,
        minTicks: 10,
        majorTicksInterval: 40,
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
      };

      const opt = util.createLinearGaugeOption(defLinearGateOpt);

      opt.title = levelNames[this.levelNdx];
      return opt;
    },
    tempGaugeOpt() {
      const defTempGaugeOpt = {
        unit: '°C',
        title: 'Temperature',
        min: 0,
        max: 320,
        width: 320,
        height: 200,
        minTicks: 10,
        majorTicksInterval: 40,
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
      };

      const opt = util.createRadialGaugeOption(defTempGaugeOpt);

      return opt;
    },
    pressureGaugeOpt() {
      const defPressureGaugeOpt = {
        unit: 'mBar',
        title: 'Pressure',
        min: 0,
        max: 320,
        width: 320,
        height: 200,
        minTicks: 10,
        majorTicksInterval: 40,
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
      };

      const opt = util.createRadialGaugeOption(defPressureGaugeOpt);

      return opt;
    },
  },
  methods: {
    onLevelLeftClick() {
      this.levelNdx = this.levelNdx - 1;

      if (this.levelNdx < 0) {
        this.levelNdx = levelNames.length - 1;
      }
    },
    onLevelRightClick() {
      this.levelNdx = this.levelNdx + 1;

      if (this.levelNdx >= levelNames.length) {
        this.levelNdx = 0;
      }
    },
  },
  data() {
    return {
      levelNdx: 0,
    };
  },
};
</script>

<style>
</style>
