<template>
<v-card>
  <v-card-title>
    <h2>Vessel Data</h2>
  </v-card-title>

  <v-card-text>
    <v-container fluid grid-list-lg>
      <v-subheader>
      Trim/List
      </v-subheader>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Trim"
           v-model.number="trim.value"
           type="number"/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
           readonly
           label="List"
           v-model.number="list.value"
           type="number"/>
        </v-flex>
      </v-layout>

      <v-subheader>
      Absolute Reference Pressure Sensors
      </v-subheader>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
           readonly
           label="Absolute Pressure"
           v-model.number="channelByNum(absSensorCfg.channel).value"
           hint="mBar"
           persistent-hint
           type="number"/>
        </v-flex>
        <v-flex xs6/>

        <v-flex xs12 v-for="(absSensor, ndx) in absSensorCfgList" :key="'absSensor' + ndx">
          <v-layout row wrap>
            <v-flex xs4>
              <v-text-field
               readonly
               label="Name"
               v-model="absSensor.name" />
            </v-flex>
            <v-flex xs4>
              <v-text-field
               readonly
               label="Type"
               v-model="absSensor.type" />
            </v-flex>
            <v-flex xs2>
              <v-text-field
               readonly
               label="Value"
               hint="mBar"
               persistent-hint
               v-model.number="channelByNum(absSensor.channel).value" />
            </v-flex>
            <v-flex xs2>
              <v-text-field
               readonly
               label="Status"
               :value="channelByNum(absSensor.channel).sensorFault ? 'Fault' : 'OK'" />

            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

    </v-container>
  </v-card-text>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Vessel',
  computed: {
    ...mapGetters([
      'channelByNum',
      'vessel',
    ]),
    trim() {
      const chnlNum = this.vessel.trimList.trim;
      return this.channelByNum(chnlNum);
    },
    list() {
      const chnlNum = this.vessel.trimList.list;
      return this.channelByNum(chnlNum);
    },
    absSensorCfg() {
      return this.vessel.refAbsPressure;
    },
    absSensorCfgList() {
      return this.vessel.refAbsPressure.sensors;
    },
  },
};
</script>

<style>
</style>
