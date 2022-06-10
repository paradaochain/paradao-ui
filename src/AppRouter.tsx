import React, { lazy } from 'react';
import { Router } from 'wouter';
import WRoute from '@components/WRoute';

const Home = lazy(() => import('@views/Home'));

const AppRouter: React.FC = () => {
  return (
    <Router>
      <WRoute layout path="/" component={Home} />
    </Router>
  );
};

export default AppRouter;
