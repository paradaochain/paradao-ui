import DAO from '@interfaces/dao';
import { IntlAddress } from '@utils/Intl';
import React from 'react';
import { useLocation } from 'wouter';
import { CardContainer, CardDescrip, CardHeader, CardProposals, CardStat, CardStatData, CardStats, CardStatTitle } from './DaoCardStyles';
import tw from 'twin.macro';
import daoLogo from '../.././../components/icons/paradao-icon.svg';

const DaoCard: React.FC<DAO> = ({ name, address, purpose, logo, funds, members, totalProposals }) => {
  const [, setLocation] = useLocation();
  return (
    <CardContainer onClick={() => setLocation(`/dao/${address}`)}>
      <div tw="flex flex-col justify-between items-center w-full h-full gap-7">
        <CardHeader>
          <div tw="w-20 h-20">
            <img
              tw="w-full h-full rounded-full pointer-events-none"
              src={logo ? logo : daoLogo}
              alt={`${name}-card-logo`}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.setAttribute('src', daoLogo);
              }}
            />
          </div>
          <div tw="flex flex-col space-y-2 font-medium justify-start items-start">
            <div tw="text-2xl font-bold tracking-tight">{name}</div>
            <div tw="text-sm text-gray-500">{IntlAddress(address)}</div>
          </div>
        </CardHeader>
        <CardDescrip>
          <p tw="w-full h-full font-normal text-gray-700 truncate">{purpose}</p>
        </CardDescrip>
        <CardStats>
          <CardStat>
            <CardStatTitle>DAO funds</CardStatTitle>
            <CardStatData>{funds}</CardStatData>
          </CardStat>
          <CardStat>
            <CardStatTitle>Members</CardStatTitle>
            <CardStatData>{members}</CardStatData>
          </CardStat>
        </CardStats>
        <CardProposals>
          <p tw="tracking-widest text-xl">
            <span tw="font-bold">Proposals</span>
          </p>
          <CardStatTitle>{`${totalProposals} in total`}</CardStatTitle>
        </CardProposals>
      </div>
    </CardContainer>
  );
};
export default DaoCard;
