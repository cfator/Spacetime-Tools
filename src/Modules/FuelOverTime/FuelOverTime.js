import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
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
            <LineChart width={800} height={600} data={this.store.output} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>
          </div>
        }
      </div>
    )
  }
}
