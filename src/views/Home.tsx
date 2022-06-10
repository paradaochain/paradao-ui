import React from 'react';
import { Alert } from 'flowbite-react';

const Home: React.FC = () => {
  return (
    <Alert color="blue">
      <span>
        <span className="font-medium">ParaDAO</span> Flowbite working as expected
      </span>
    </Alert>
  );
};

export default Home;
