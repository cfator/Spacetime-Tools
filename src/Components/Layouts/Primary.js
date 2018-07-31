import {Component} from 'react';
import {Helmet} from 'react-helmet';
import {inject, observer} from 'mobx-react';
import {Provider} from 'mobx-react';
import {Link, Route, BrowserRouter, Switch} from 'react-router-dom';
import React from 'react';
import ReactFileReader from 'react-file-reader';
import Select from 'react-select';

import FuelOverTime from '@Modules/FuelOverTime/FuelOverTime';
import LatencyOverTime from '@Modules/LatencyOverTime/LatencyOverTime';
import Home from '@Modules/Home/Home';
import OdometerOverTime from '@Modules/OdometerOverTime/OdometerOverTime';
import OilLifeOverTime from '@Modules/OilLifeOverTime/OilLifeOverTime';
import Playground from '@Modules/Playground/Playground';

import LatencyOverTimeStore from '@Stores/LatencyOverTime';

import './Primary.scss';
import 'react-select/dist/react-select.css';

@inject('store')
@observer

export default class PrimaryLayout extends Component {
  constructor(props) {
    super(props);
    this.store = props.store;
  }

  handleFiles = (files) => {
    // decode the file contents given to us in base64
    let parts = files.base64.split(',');
    let contents = atob(parts[1]);

    this.store.setFileContents(contents);
    this.store.parseCSV();
  };

  render() {
    return (
      <div className='Primary'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Spacetime Tools</title>
        </Helmet>
        <header>
          <ReactFileReader fileTypes={['.csv']} base64={true} handleFiles={(files) => this.handleFiles(files)}>
            <button className='btn upload-file'>Upload</button>
          </ReactFileReader>
          <label className='esn-filter-label'>ESN Filter:&nbsp;</label>
          <Select
            value={this.store.selectedESN}
            onChange={this.store.onESNFilterChange}
            options={this.store.filterESNs}
            clearable={false}
          />
          <div className='Nav'>
            <span className='nav-item'>
              <Link to='/latency-over-time'>Latency</Link>
            </span>
            <span className='nav-item'>
              <Link to='/oil-life-over-time'>Oil Life Remaining</Link>
            </span>
            <span className='nav-item'>
              <Link to='/odometer-over-time'>Odometer</Link>
            </span>
            <span className='nav-item'>
              <Link to='/fuel-over-time'>Fuel Level</Link>
            </span>
          </div>
        </header>
        <BrowserRouter>
          <main className='app-main'>
            <div className='content'>
              <Route exact path='/' component={Home} />
              <Route path='/latency-over-time' component={LatencyOverTime} />
              <Route path='/oil-life-over-time' component={OilLifeOverTime} />
              <Route path='/odometer-over-time' component={OdometerOverTime} />
              <Route path='/fuel-over-time' component={FuelOverTime} />
              <Route path='/playground' component={Playground} />
            </div>
          </main>
        </BrowserRouter>
      </div>
    )
  }
}
