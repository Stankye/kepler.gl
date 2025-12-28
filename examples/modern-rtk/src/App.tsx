import KeplerGl from '@kepler.gl/components';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { useDispatch, useSelector } from 'react-redux';
import { loadCustomData } from './appSlice';
import { RootState, AppDispatch } from './store';

const MAPBOX_TOKEN = process.env.MapboxAccessToken || '';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
`;

const SidePanel = styled.div`
  width: 300px;
  background: #f7f7f7;
  padding: 20px;
  z-index: 100;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  font-family: sans-serif;
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`;

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.app);

  // Example TanStack Query usage
  const { isPending, error: queryError, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/keplergl/kepler.gl').then((res) =>
        res.json(),
      ),
  });

  return (
    <Container>
      <SidePanel>
        <h2>Modern RTK + TanStack</h2>
        {isPending && 'Loading repo info...'}
        {queryError && 'An error has occurred: ' + queryError.message}
        {data && (
          <div>
            <p><strong>{data.full_name}</strong></p>
            <p>{data.description}</p>
            <p>Stars: {data.stargazers_count}</p>
          </div>
        )}
        <hr />
        <p>
          This example demonstrates Kepler.gl running with Redux Toolkit 2.0 and TanStack Query.
        </p>
        <button 
          onClick={() => dispatch(loadCustomData() as any)}
          disabled={isLoading}
          style={{
            padding: '10px',
            marginTop: '10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {isLoading ? 'Loading Data...' : 'Load Earthquakes Data'}
        </button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </SidePanel>
      <MapContainer>
        {/* @ts-ignore */}
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl
              id="map"
              mapboxApiAccessToken={MAPBOX_TOKEN}
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </MapContainer>
    </Container>
  );
}

export default App;
