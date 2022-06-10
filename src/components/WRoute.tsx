import React from 'react';
import { Redirect, RouteProps, Route } from 'wouter';
import Layout from './Layout';

interface Props {
  layout?: boolean;
  auth?: boolean;
}

const WRoute: React.FC<RouteProps & Props> = ({ layout, auth, ...rest }) => {
  const isAuth = true; // Temporaly set to true

  if (auth && !isAuth) return <Redirect to="/" />;
  if (!layout) return <Route {...rest} />;

  return (
    <Layout>
      <Route {...rest} />
    </Layout>
  );
};

export default WRoute;
