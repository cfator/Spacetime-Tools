import {BrowserRouter, Route} from 'react-router-dom';
import {Provider} from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';

import AppState from '@Stores/AppState';
import PrimaryLayout from '@Components/Layouts/Primary';

import style from './_scss/main.scss';

const App = () => (
  <BrowserRouter>
    <Provider store={AppState}>
      <PrimaryLayout />
    </Provider>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));

module.hot.accept();
