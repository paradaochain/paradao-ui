import React, { lazy } from 'react';
import { Switch } from 'wouter';
import WRoute from '@components/WRoute';

const Home = lazy(() => import('@views/Home'));
const Create = lazy(() => import('@views/Create'));

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <WRoute layout path="/create" component={Create} />
      <WRoute layout path="/" component={Home} />
    </Switch>
  );
};

export default AppRouter;
