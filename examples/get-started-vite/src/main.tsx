// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Dispatch} from 'react';
import ReactDOM from 'react-dom/client';
import {connect, Provider} from 'react-redux';

import {configureStore} from '@reduxjs/toolkit';

import KeplerGl from '@kepler.gl/components';
import keplerGlReducer, {enhanceReduxMiddleware, KeplerGlState} from '@kepler.gl/reducers';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

// create reducers
const reducer = {
  // mount keplerGl reducer
  keplerGl: keplerGlReducer.initialState({
    uiState: {
      readOnly: false,
      currentModal: null
    }
  })
};

// create middlewares
const middleWares = enhanceReduxMiddleware([
  // Add other middlewares here
]);

// create store
const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).concat(middleWares as any)
});

const App = () => (
  <div
    style={{
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%'
    }}
  >
    <AutoSizer>
      {({height, width}) => (
        <KeplerGl
          mapboxApiAccessToken="pk.eyJ1IjoiaWdvcjEzMTMxMyIsImEiOiJjbTRtMWxoMnIwN3VhMmlxOGRnZ3AxcGhhIn0.d9YD6z5nsBNzPXrXWzIaAA"
          id="map"
          width={width}
          height={height}
        />
      )}
    </AutoSizer>
  </div>
);

const mapStateToProps = (state: KeplerGlState) => state;
const dispatchToProps = (dispatch: Dispatch<any>) => ({dispatch});
const ConnectedApp = connect(mapStateToProps, dispatchToProps)(App);
const Root = () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<Root />);
}
