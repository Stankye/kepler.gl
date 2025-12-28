// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {configureStore} from '@reduxjs/toolkit';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import {createLogger} from 'redux-logger';
import {thunk} from 'redux-thunk';
import {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import demoReducer from './reducers/index';

const reducer = {
  demo: demoReducer,
  routing: routerReducer
};

const middlewares = [thunk, routerMiddleware(browserHistory)];

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'local') {
  // Redux logger
  const logger = createLogger({
    collapsed: () => true // Collapse all actions for more compact log
  });
  middlewares.push(logger);
}

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      thunk: false // We are adding thunk manually via middlewares array
    }).concat(enhanceReduxMiddleware(middlewares)),
  devTools: {
    actionsDenylist: [
      '@@kepler.gl/MOUSE_MOVE',
      '@@kepler.gl/UPDATE_MAP',
      '@@kepler.gl/LAYER_HOVER'
    ]
  },
  preloadedState: {}
});

export default store;
