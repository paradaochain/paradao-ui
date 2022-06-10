import React, { Suspense } from 'react';
import AppRouter from './AppRouter';
import { Spinner } from 'flowbite-react';

const App: React.FC = () => {
  return (
    <Suspense fallback={<Spinner aria-label="Center-aligned spinner example" />}>
      <AppRouter />
    </Suspense>
  );
};

export default App;
