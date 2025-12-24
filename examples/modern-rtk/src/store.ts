import {configureStore} from '@reduxjs/toolkit';
import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import {Middleware} from 'redux';
import appReducer from './appSlice';

const store = configureStore({
  reducer: {
    keplerGl: keplerGlReducer,
    app: appReducer
  },
  middleware: getDefaultMiddleware => {
    const defaultMiddleware = getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    });

    // enhanceReduxMiddleware expects an array of middlewares
    // We cast to any to avoid strict type conflicts between Redux 5 types and Kepler's internal types if any
    return enhanceReduxMiddleware(defaultMiddleware as any) as any;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
