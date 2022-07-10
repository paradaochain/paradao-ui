import Button from '@components/Button/Button';
import React from 'react';
import { BsDiscord } from 'react-icons/bs';
import { BsInstagram } from 'react-icons/bs';
import { BsYoutube } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';
import ProposalList from '@components/ProposalList/ProposalList';
import { Proposal } from '@interfaces/Proposal';

const fakeDao = {
  name: 'Black Lives Matter',
  token: 'BLM',
  daoAddress: 'blm.paradaochain.org',
  descrip:
    'Black Lives Matter is a decentralized political and social movement that seeks to highlight racism, discrimination, and inequality experienced by black people. When its supporters come together, they do so primarily to protest incidents of police brutality and racially motivated violence against black people.',
  logo: 'https://blacklivesmatter.com/wp-content/themes/blm/dist/images/logo-black-lives-matter.png',
  funds: '59874 USD',
  members: 987,
  activeProposals: [
    {
      title: 'EEUU president would be black skin',
      metadata_url: '',
      proposer: 'Somebody',
      expires: new Date(),
      tx: 'Voting',
      threshold: 0.5,
      votes: 0.6
    },
    {
      title: 'Black people cn do everything',
      metadata_url: '',
      proposer: 'Somebody black',
      expires: new Date(),
      tx: 'Voting',
      threshold: 0.5,
      votes: 0.3
    },
    {
      title: 'Black people for president',
      metadata_url: '',
      proposer: 'J0nl1',
      expires: new Date(),
      tx: 'Voting',
      threshold: 0.5,
      votes: 0.5
    }
  ],
  totalProposals: 12,
  links: {
    homepage: 'https://blacklivesmatter.com/',
    instagram: 'https://www.instagram.com/blklivesmatter/',
    youtube: 'https://www.youtube.com/channel/UCud6qp6HqpAJU4STFw8Uk7Q',
    discord: 'https://www.youtube.com/channel/UCud6qp6HqpAJU4STFw8Uk7Q'
  }
};

const DaoDetail: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-5 relative">
      <div className="rounded-lg w-full flex">
        <div className="max-w-[8rem]">
          <img className="w-full rounded-full" src={fakeDao.logo} />
        </div>
        <div className="flex flex-col flex-1 py-2 px-5">
          <h1 className="font-bold text-3xl">{fakeDao.name}</h1>
          <p className="font-bold text-gray-600 text-sm">{fakeDao.daoAddress}</p>
          <div className="flex mt-5 gap-10 items-center">
            <div className="text-center font-bold">
              <p className="text-xs text-gray-500">Members</p>
              <p>{fakeDao.members}</p>
            </div>
            <span className="w-[1px] bg-gray-300 h-[80%]"></span>
            <div className="text-center font-bold">
              <p className="text-xs text-gray-500">Proposals</p>
              <p>{fakeDao.totalProposals}</p>
            </div>
            <span className="w-[1px] bg-gray-300 h-[80%]"></span>
            <div className="text-center font-bold">
              <p className="text-xs text-gray-500 w-full">Social Links</p>
              <div className="flex  items-center justify-center gap-5">
                {fakeDao.links.homepage && (
                  <a href={fakeDao.links.homepage}>
                    <BiWorld className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
                  </a>
                )}
                {fakeDao.links.instagram && (
                  <a href={fakeDao.links.instagram}>
                    <BsInstagram className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
                  </a>
                )}
                {fakeDao.links.youtube && (
                  <a href={fakeDao.links.instagram}>
                    <BsYoutube className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
                  </a>
                )}
                {fakeDao.links.discord && (
                  <a href={fakeDao.links.discord}>
                    <BsDiscord className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button>Join</Button>
        </div>
      </div>
      <div className="p-5 my-5 bg-white w-full rounded-lg">
        <p className=" text-">{fakeDao.descrip}</p>
      </div>
      <div className="grid grid-cols-3 w-full gap-5">
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">Governance Details</h3>
          <div className="flex flex-col"></div>
        </div>
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">Treassury</h3>
          <div className="flex flex-col"></div>
        </div>
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">More info</h3>
        </div>
      </div>
      <div className="w-full flex my-8 justify-between items-center">
        <h2 className="font-bold text-2xl">
          Active Proposals <span className="bg-gray-200 p-2 rounded-full">{fakeDao.activeProposals.length}</span>
        </h2>
        <Button>New proposal</Button>
      </div>
      <ProposalList proposalList={fakeDao.activeProposals as Proposal[]} />
    </div>
  );
};

export default DaoDetail;
