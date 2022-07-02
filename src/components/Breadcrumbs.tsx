import React, { FC } from 'react';
import { useLocation } from 'wouter';
import tw from 'twin.macro';
import { Home as HomeIcon, NextCrumb } from '@icons/mui';

const BcBtn = tw.button`text-sm font-medium text-gray-700 hover:text-gray-900 capitalize`;
const BcSpan = tw.span`ml-1 text-sm font-medium text-gray-500 md:ml-2 capitalize`;

const Breadcrumbs: FC = () => {
  const [location, setLocation] = useLocation();
  const crumbs = location.replace(/^\//, '').split('/');

  return (
    <nav tw="flex h-6" aria-label="Breadcrumb">
      <ol tw="inline-flex items-center space-x-1 md:space-x-2">
        <li tw="inline-flex items-center">
          <BcBtn tw="inline-flex items-center" onClick={() => setLocation('/')}>
            <HomeIcon />
            Home
          </BcBtn>
        </li>
        {/* Note this works for now, not sure what the current page structure will look like, prob need to adjust */}
        {/* always will have home, the current page (last one in the array) is not a button, the rest should be buttons */}
        {crumbs.length > 0 &&
          crumbs.map((loc, i) => {
            // console.log('ummm', crumbs, location);
            if (loc) {
              // if (i === crumbs.length - 1) {
              //   return (
              //     <li aria-current="page">
              //       <div tw="flex items-center">
              //         < NextCrumb />
              //         <BcSpan>{ loc }</BcSpan>
              //       </div>
              //     </li>
              //   );
              // } else {
              return (
                <li key={ `${loc}-${i}` }>
                  <div tw="flex items-center">
                    <NextCrumb />
                    <BcBtn tw="ml-1 md:ml-2" onClick={() => setLocation(loc)}>
                      {' '}
                      {loc.replace('-', ' ')}
                    </BcBtn>
                  </div>
                </li>
              );
              // }
            }
          })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
