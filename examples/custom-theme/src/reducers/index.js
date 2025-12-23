// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers} from 'redux';

import keplerGlReducer from '@kepler.gl/reducers';

import {INIT} from '../actions';

// INITIAL_APP_STATE
const initialAppState = {
  appName: 'example'
};

// Action handlers
const actionHandler = {
  [INIT]: state => ({
    ...state,
    loaded: true
  })
};

// App reducer
export function appReducer(state = initialAppState, action) {
  const handler = actionHandler[action?.type];
  return handler ? handler(state, action) : state;
}

// export demoReducer to be combined in website app
export default combineReducers({
  // mount keplerGl reducer
  keplerGl: keplerGlReducer,
  app: appReducer
});
