// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {configureStore} from '@reduxjs/toolkit';
import {enhanceReduxMiddleware} from '@kepler.gl/reducers';

import demoReducer from './reducers/index';

const reducer = {
  demo: demoReducer
};

const middlewares = enhanceReduxMiddleware([]);

export const enhancers = [];

export default configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares)
});
