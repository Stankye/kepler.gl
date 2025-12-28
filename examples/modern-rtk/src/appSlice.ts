import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {addDataToMap} from '@kepler.gl/actions';
import {processCsvData} from '@kepler.gl/processors';

// Define a type for the slice state
interface AppState {
  isLoading: boolean;
  error: string | null;
  customData: any | null;
}

const initialState: AppState = {
  isLoading: false,
  error: null,
  customData: null
};

// Example thunk that fetches data and updates Kepler.gl
export const loadCustomData = createAsyncThunk('app/loadCustomData', async (_, {dispatch}) => {
  // Simulate fetching CSV data
  const response = await fetch(
    'https://raw.githubusercontent.com/keplergl/kepler.gl-data/master/earthquakes/data.csv'
  );
  const csvData = await response.text();

  // Process data using Kepler.gl processor
  const data = processCsvData(csvData);

  if (!data) {
    throw new Error('Failed to process CSV data');
  }

  // Dispatch Kepler.gl action to add data to map
  dispatch(
    addDataToMap({
      datasets: {
        info: {
          label: 'Earthquakes',
          id: 'earthquakes'
        },
        data
      },
      options: {
        centerMap: true,
        readOnly: false
      },
      config: {}
    })
  );

  return 'Data Loaded';
});

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadCustomData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCustomData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loadCustomData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load data';
      });
  }
});

export const {setLoading} = appSlice.actions;
export default appSlice.reducer;
