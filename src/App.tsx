import React, { Suspense } from 'react';
import PolkadorProvider from '@context/polkadot';
import AppRouter from './AppRouter';

const App: React.FC = () => {
  return (
    <Suspense fallback={<h1 aria-label="loading screen">Loading ParaDAO...</h1>}>
      <PolkadorProvider>
        <AppRouter />
      </PolkadorProvider>
    </Suspense>
  );
};

export default App;
