import {Component} from 'react';
import {Link, BrowserRouter, Route} from 'react-router-dom';
import React from 'react';

import FuelOverTime from '@Modules/FuelOverTime/FuelOverTime';
import LatencyOverTime from '@Modules/LatencyOverTime/LatencyOverTime';
import Home from '@Modules/Home/Home';
import OdometerOverTime from '@Modules/OdometerOverTime/OdometerOverTime';
import OilLifeOverTime from '@Modules/OilLifeOverTime/OilLifeOverTime';
import Playground from '@Modules/Playground/Playground';

import './LeftNav.scss';

export default class LeftNav extends Component {
  render() {
    return (
      <div className='LeftNav'>
        <ol>
          <li className='nav-item'>
            <Link to='/latency-over-time'>Latency</Link>
          </li>
          <li className='nav-item'>
            <Link to='/oil-life-over-time'>Oil Life Remaining</Link>
          </li>
          <li className='nav-item'>
            <Link to='/odometer-over-time'>Odometer</Link>
          </li>
          <li className='nav-item'>
            <Link to='/fuel-over-time'>Fuel Level</Link>
          </li>
        </ol>
      </div>
    )
  }
}
