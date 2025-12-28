# Modern RTK + Vite Example

This example demonstrates how to use **Kepler.gl** with a modern React stack, including:

- **[Redux Toolkit (RTK)](https://redux-toolkit.js.org/)** for state management.
- **[Vite](https://vitejs.dev/)** for fast development and building.
- **[TanStack Query](https://tanstack.com/query/latest)** for data fetching.
- **TypeScript** for type safety.

## Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.x)
- [Yarn](https://yarnpkg.com/) (v4.x is used in this repo)
- A [Mapbox Access Token](https://account.mapbox.com/access-tokens/)

## Installation

Since this example is part of the Kepler.gl monorepo workspace, you should install dependencies from the repository root.

1. **Install dependencies** (from the root of the `kepler.gl` repo):

   ```bash
   yarn install
   ```

## Running the App

1. **Navigate to the example directory**:

   ```bash
   cd examples/modern-rtk
   ```

2. **Set your Mapbox Token**:
   You need to export your Mapbox Access Token as an environment variable.

   **Mac/Linux:**

   ```bash
   export MapboxAccessToken=<your_token_here>
   ```

   **Windows (PowerShell):**

   ```powershell
   $env:MapboxAccessToken="<your_token_here>"
   ```

3. **Start the development server**:

   ```bash
   yarn dev
   ```

4. **Open the app**:
   Visit [http://localhost:8082](http://localhost:8082) in your browser.

## Building for Production

To build the application for production:

```bash
yarn build
```

The output will be in the `dist` directory.

## Project Structure

- **`src/store.ts`**: Configures the Redux store using RTK's `configureStore`.
- **`src/appSlice.ts`**: A Redux Toolkit slice for managing application state.
- **`src/App.tsx`**: The main component that renders `KeplerGl` and connects to the store.
- **`vite.config.ts`**: Vite configuration, including aliases to resolve local Kepler.gl packages.
