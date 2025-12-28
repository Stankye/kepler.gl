// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {configureStore} from '@reduxjs/toolkit';
import keplerGlReducer, {uiStateUpdaters, enhanceReduxMiddleware} from '@kepler.gl/reducers';
import appReducer from './app-reducer';

const customizedKeplerGlReducer = keplerGlReducer
  .initialState({
    uiState: {
      // hide side panel to disallower user customize the map
      readOnly: true,

      // customize which map control button to show
      mapControls: {
        ...uiStateUpdaters.DEFAULT_MAP_CONTROLS,
        visibleLayers: {
          show: false
        },
        mapLegend: {
          show: true,
          active: true
        },
        toggle3d: {
          show: false
        },
        splitMap: {
          show: false
        }
      }
    }
  })
  // handle additional actions
  .plugin({
    HIDE_AND_SHOW_SIDE_PANEL: state => ({
      ...state,
      uiState: {
        ...state.uiState,
        readOnly: !state.uiState.readOnly
      }
    })
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
