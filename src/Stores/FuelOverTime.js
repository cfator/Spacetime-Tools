import {computed, observable, action} from 'mobx';
import moment from 'moment';

import ColumnNames from '@Constants/ColumnNames';

export default class LatencyOverTime {
  active = false;

  @observable result = [];

  // result to chart
  @computed get output() {
    return this.result;
  };

  constructor(appState) {
    this.appState = appState;
  }

  // allows visual components to set this store as active so it will update when needed but refrain when nothing to show
  setActive(active) {
    this.active = active;
    if(active) {
      this.analyze();
    }
  }

  analyze() {
    if(!this.active) {
      return [];
    }

    // do the analysis
    let output = [];

    for(let i = 0; i < this.appState.esnFilteredValueRows.length - 1; i++) {
        let fuelPct  = parseFloat(this.appState.getFilteredColRowValue(ColumnNames.ObdFuelLevelPct, i));
        let esn  = this.appState.getFilteredColRowValue(ColumnNames.ESN, i);
        let time  = moment.utc(this.appState.getFilteredColRowValue(ColumnNames.TimeMessageReceivedUTC, i));

        output.push({name: esn, time: time, percent: fuelPct});
    }

    this.result = output;
  }
}
