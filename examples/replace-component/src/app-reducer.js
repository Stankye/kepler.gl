// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import KeplerGlSchema from '@kepler.gl/schemas';

// CONSTANTS
export const INIT = 'INIT';
export const SET_MAP_CONFIG = 'SET_MAP_CONFIG';

// ACTIONS
export const appInit = () => ({type: INIT});
export const setMapConfig = payload => ({type: SET_MAP_CONFIG, payload});

// INITIAL_STATE
const initialState = {
  appName: 'example',
  loaded: false
};

// ACTION HANDLERS
const actionHandler = {
  [INIT]: state => ({
    ...state,
    loaded: true
  }),
  [SET_MAP_CONFIG]: (state, action) => ({
    ...state,
    mapConfig: KeplerGlSchema.getConfigToSave(action.payload)
  })
};

// REDUCER
function appReducer(state = initialState, action) {
  const handler = actionHandler[action?.type];
  return handler ? handler(state, action) : state;
}

export default appReducer;
