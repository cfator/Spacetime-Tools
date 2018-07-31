import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import React from 'react';

import './FuelOverTime.scss';

@inject('store')
@observer

export default class FuelOverTime extends Component {
  constructor(props) {
    super(props);
    this.store = props.store.fuelOverTime;

    this.appState = this.props.store;
  }

  componentWillMount() {
    this.store.setActive(true);
  }

  componentWillUnMount() {
    this.store.setActive(false);
  }

  tooltipFormat(data) {
    let out;
    if(data.payload.length>0) {
      out = data.payload[0].payload.percent+'%  At: '+data.payload[0].payload.time;
    } else {
      out = '';
    }
    return out;
  }

  render() {
    return (
      <div className='FuelOverTime'>
        {this.appState.allSelected &&
          <div className='section-heading'>
            <div className=''>Select an ESN to chart the trend.</div>
          </div>
        }
        {!this.appState.allSelected &&
          <div>
            <div className='section-heading'>
              <label className='section-label'>Fuel over Time&nbsp;</label>
            </div>
            <LineChart width={1200} height={600} data={this.store.output} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <XAxis dataKey="time" hide />
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="percent" stroke="#8884d8" />
              <Tooltip content={this.tooltipFormat} animationDuration={200} />
            </LineChart>
          </div>
        }
      </div>
    )
  }
}
