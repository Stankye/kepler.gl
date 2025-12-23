// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// CONSTANTS
export const INIT = 'INIT';
export const SHOW_MODAL = 'SHOW_MODAL';

// ACTIONS
export const appInit = () => ({type: INIT});
export const showModal = payload => ({type: SHOW_MODAL, payload});

// INITIAL_STATE
const initialState = {
  appName: 'example',
  loaded: false,
  modal: null
};

// ACTION HANDLERS
const actionHandler = {
  [INIT]: state => ({
    ...state,
    loaded: true
  }),

  [SHOW_MODAL]: (state, action) => ({
    ...state,
    modal: action.payload
  })
};

// REDUCER
function appReducer(state = initialState, action) {
  const handler = actionHandler[action?.type];
  return handler ? handler(state, action) : state;
}

export default appReducer;
