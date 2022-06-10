import React, { PropsWithChildren } from 'react';

const Layout: React.FC<PropsWithChildren<{}>> = ({ children: Component }) => {
  return (
    <>
      <main className="">{Component}</main>
    </>
  );
};

export default Layout;
