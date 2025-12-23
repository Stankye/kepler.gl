// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// CONSTANTS
export const INIT = 'INIT';

// ACTIONS
export const appInit = () => ({type: INIT});

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
  })
};

// REDUCER
function appReducer(state = initialState, action) {
  const handler = actionHandler[action?.type];
  return handler ? handler(state, action) : state;
}

export default appReducer;
