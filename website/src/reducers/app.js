// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const DEFAULT_APP_STATE = {};

const actionHandler = {
  INIT: state => ({...state, ready: true})
};

export default function appReducer(state = DEFAULT_APP_STATE, action) {
  const handler = actionHandler[action?.type];
  return handler ? handler(state, action) : state;
}
