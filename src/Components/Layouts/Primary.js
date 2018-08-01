import {Component} from 'react';
import {Helmet} from 'react-helmet';
import {inject, observer} from 'mobx-react';
import {Provider} from 'mobx-react';
import {Link, Route, BrowserRouter, Switch} from 'react-router-dom';
import React from 'react';
// import ReactFileReader from 'react-file-reader';
import ReactFileReader from './ReactFileReader';

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

    this.store.isLoading = false;
  };

  render() {
    return (
      <BrowserRouter>
        <div className='Primary'>
          {this.store.isLoading &&
            <div className='loading'>
              Loading...
            </div>
          }
          <Helmet>
            <meta charSet='utf-8' />
            <title>Telematics Data Analyzer</title>
          </Helmet>
          <header>
            <ReactFileReader fileTypes={['.csv']} base64={true} handleFiles={(files) => this.handleFiles(files)}
                             onStart={() => this.store.isLoading = true}>
              <button className='btn upload-file'>Upload</button>
            </ReactFileReader>
            {this.store.fileValueRows.length === 0 &&
              <div className='section-heading'>
                <div className='instruction'>Upload a data CSV file to continue.</div>
              </div>
            }
            {this.store.fileValueRows.length > 0 &&
              <div className='controls'>
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
              </div>
            }
          </header>
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
        </div>
      </BrowserRouter>
    )
  }
}
