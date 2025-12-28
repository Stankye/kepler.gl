// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {configureStore} from '@reduxjs/toolkit';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {taskMiddleware} from 'react-palm/tasks';
import {thunk} from 'redux-thunk';

import {browserHistory} from 'react-router';
import appReducer from './app';
import demoReducer from '../../../examples/demo-app/src/reducers';
import analyticsMiddleware from './analytics';

const reducers = {
  demo: demoReducer,
  app: appReducer,
  routing: routerReducer
};

export const middlewares = [
  taskMiddleware,
  thunk,
  routerMiddleware(browserHistory),
  analyticsMiddleware
];

export default configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares)
});
