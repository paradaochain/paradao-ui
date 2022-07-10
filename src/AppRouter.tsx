import React, { lazy } from 'react';
import { Redirect, Switch } from 'wouter';
import WRoute from '@components/WRoute';

/* const Home = lazy(() => import('@views/Home')); */
const Create = lazy(() => import('@views/Create'));
const AllDaos = lazy(() => import('@views/AllDaos/AllDaos'));
const DaoDetail = lazy(() => import('@views/DaoDetail/DaoDetail'));

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <WRoute layout path="/" component={AllDaos} />
      <WRoute layout path="/create" component={Create} />
      <WRoute layout path="/dao/:daoAddress" component={DaoDetail} />
      <Redirect to="/" />
    </Switch>
  );
};

export default AppRouter;
