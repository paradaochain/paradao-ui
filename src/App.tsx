import React, { Suspense } from 'react';
import AppRouter from './AppRouter';

const App: React.FC = () => {
  return (
    <Suspense fallback={<h1 aria-label="loading screen">Loading ParaDAO...</h1>}>
      <AppRouter />
    </Suspense>
  );
};

export default App;
