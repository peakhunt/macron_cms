<template>
<v-card>
  <v-card-title>
    <h2>Channel {{chnlNum}}</h2>
  </v-card-title>
  <v-card-text>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
           readonly
           label="Channel Number"
           v-model.number="chnlNum"
           type="number"/>
        </v-flex>
        <v-flex xs12>
          <v-text-field
           readonly
           label="Description"
           v-model="chnlName"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Direction"
           v-model="chnlDir"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Type"
           v-model="chnlType"/>
        </v-flex>
        <v-flex xs6 v-if="chnlType==='analog'">
          <v-text-field
           readonly
           label="Conversion A"
           v-model="chnlConv.a"/>
        </v-flex>
        <v-flex xs6 v-if="chnlType==='analog'">
          <v-text-field
           readonly
           label="Conversion B"
           v-model="chnlConv.b"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Value"
           v-model="chnlValue"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Sensor Fault"
           v-model="chnlSensorFault"/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Channel',
  props: {
    chnl: { type: Object, default: null },
  },
  computed: {
    ...mapGetters([
      'channelByNum',
    ]),
    chnlNum: {
      get() {
        return this.chnl === null ? 0 : this.chnl.chnlNum;
      },
    },
    chnlDir: {
      get() {
        return this.chnl === null ? '' : this.chnl.chnlCfg.dir;
      },
    },
    chnlType: {
      get() {
        return this.chnl === null ? '' : this.chnl.chnlCfg.type;
      },
    },
    chnlName: {
      get() {
        return this.chnl === null ? '' : this.chnl.chnlCfg.name;
      },
    },
    chnlConv: {
      get() {
        return this.chnl === null ? '' : this.chnl.chnlCfg.conv;
      },
    },
    chnlValue: {
      get() {
        return this.chnl === null ? '' : this.chnl.value;
      },
    },
    chnlSensorFault: {
      get() {
        return this.chnl === null ? '' : this.chnl.sensorFault;
      },
    },
  },
};
</script>

<style>
</style>
