import React, { Suspense } from 'react';
import PolkadorProvider from '@context/polkadot';
import AppRouter from './AppRouter';
import {HorizontalSpinner} from '@components/Spinner/Spinner';

const App: React.FC = () => {
  return (
    <Suspense fallback={<h1 aria-label="loading screen">Loading... <HorizontalSpinner /></h1>}>
      <PolkadorProvider fallback={<h1 aria-label="loading screen">Loading Polkadot... <HorizontalSpinner /></h1>}>
        <AppRouter />
      </PolkadorProvider>
    </Suspense>
  );
};

export default App;
