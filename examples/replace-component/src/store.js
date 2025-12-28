// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {configureStore} from '@reduxjs/toolkit';
import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import appReducer from './app-reducer';

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  uiState: {
    // hide side panel when mounted
    activeSidePanel: null,
    // hide all modals whtn mounted
    currentModal: null
  }
});

const reducer = {
  keplerGl: customizedKeplerGlReducer,
  app: appReducer
};

const middlewares = enhanceReduxMiddleware([]);

export default configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares)
});
