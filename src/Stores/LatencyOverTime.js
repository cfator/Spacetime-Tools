import {observable, action} from 'mobx';
import moment from 'moment';

import ColumnNames from '@Constants/ColumnNames';

export default class LatencyOverTime {
  active = false;
  sortColumn = 'NONE';
  sortDirection = 'NONE';

  constructor(appState) {
    this.appState = appState;
  }

  // result grid data
  @observable output = [];

  // latency threshold selection
  // values in ms
  thresholdOptions = [
    {value: 60*1000, label: '1 min'},
    {value: 180*1000, label: '3 min'},
    {value: 300*1000, label: '5 min'},
    {value: 480*1000, label: '8 min'},
    {value: 780*1000, label: '13 min'},
    {value: 1260*1000, label: '21 min'},
    {value: 2040*1000, label: '34 min'},
    {value: 3300*1000, label: '55 min'}
  ];

  @observable selectedThreshold = this.thresholdOptions[5];

  @action onThresholdChange = (selectedOption) => {
    this.selectedThreshold = selectedOption;
    this.analyze();
  };

  // allows visual components to set this store as active so it will update when needed but refrain when nothing to show
  setActive(active) {
    this.active = active;
    if(active) {
      this.analyze();
    }
  }

  handleGridSort = (sortColumn, sortDirection) => {
    this.sortColumn = sortColumn;
    this.sortDirection = sortDirection;

    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    this.output = sortDirection === 'NONE' ? this.output : this.output.sort(comparer);
  };

  analyze() {
    if(!this.active) {
      return;
    }

    // do the analysis
    let output = [];
    for(let i = 0; i < this.appState.esnFilteredValueRows.length - 1; i++) {
      // latency is capture_time (unix->UTC) - time_rec (UTC)
      let timeSent = moment.unix(this.appState.getFilteredColRowValue(ColumnNames.UnixTime, i));
      let timeReceived = moment.utc(this.appState.getFilteredColRowValue(ColumnNames.TimeMessageReceivedUTC, i));

      // duration in ms
      let duration = moment.duration(timeReceived.diff(timeSent));

      if(duration.asMilliseconds() > this.selectedThreshold.value) {

        let signalStrength = this.appState.getFilteredColRowValue(ColumnNames.ReceiverSigStr, i);
        let lat  = this.appState.getFilteredColRowValue(ColumnNames.Latitude, i);
        let long = this.appState.getFilteredColRowValue(ColumnNames.Longitude, i);
        let ESN = this.appState.getFilteredColRowValue(ColumnNames.ESN, i);

        output.push({duration: duration/1000, signalStrength: signalStrength, cords: lat+','+long, ESN: ESN});
      }
    }

    this.output = output;
  }
}
