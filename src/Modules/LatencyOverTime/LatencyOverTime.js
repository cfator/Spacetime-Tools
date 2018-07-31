import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {LineChart, Line} from 'recharts';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import Select from 'react-select';

import './LatencyOverTime.scss';

@inject('store')
@observer

export default class LatencyOverTime extends Component {
  columns = [
    { key: 'duration', name: 'Duration', sortable: true },
    { key: 'signalStrength', name: 'Signal', sortable: true },
    { key: 'cords', name: 'Cord', width: 300, sortable: true },
    { key: 'ESN', name: 'ESN', sortable: true }
  ];

  constructor(props) {
    super(props);
    this.store = props.store.latencyOverTime;

    this.appState = this.props.store;
  }

  componentWillMount() {
    this.store.setActive(true);
  }

  componentWillUnMount() {
    this.store.setActive(false);
  }

  getCellActions(column, row) {
    let cords = row.cords;
    if (column.key === 'cords' && cords !== '0,0') {
      return [
        {
          icon: 'location-arrow',
          actions: [
            {
              text: 'Open in Google Maps',
              callback: () => {
                window.open('https://www.google.com/maps/search/?api=1&query='+cords, 'target=new');
              }
            }
          ]
        }
      ];
    }
  }

  rowGetter = (i) => {
    return this.store.output[i];
  };

  render() {
    return (
      <div className='LatencyOverTime'>
        <div className='section-heading'>
          <label className='section-label'>Select Latency Cutoff:&nbsp;</label>
          <Select
            value={this.store.selectedThreshold}
            onChange={this.store.onThresholdChange}
            options={this.store.thresholdOptions}
            clearable={false}
          />
        </div>
        <ReactDataGrid
          columns={this.columns}
          onGridSort={this.store.handleGridSort}
          rowGetter={this.rowGetter}
          rowsCount={this.store.output.length}
          minHeight={600}
          getCellActions={this.getCellActions}
        />
        <div className='footer'>{this.store.output.length+' events total'}</div>
      </div>
    )
  }
}
