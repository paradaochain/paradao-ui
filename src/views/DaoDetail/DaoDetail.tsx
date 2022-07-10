import Button from '@components/Button/Button';
import React, { useEffect, useMemo, useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import { BsInstagram } from 'react-icons/bs';
import { BsYoutube } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';
import ProposalList from '@components/ProposalList/ProposalList';
import { ProposalWithId } from '@interfaces/Proposal';
import { useLocation, useRoute } from 'wouter';
import { DAOService } from '@services/dao';
import { usePolkadot } from '@context/polkadot';
import DAO from '@interfaces/Dao';
import { ProposalStatus } from '@interfaces/ProposalStatus';

const DaoDetail: React.FC = () => {
  const [, params] = useRoute('/dao/:daoAddress');
  const [, goToPage] = useLocation();
  const { api, address } = usePolkadot();
  const [daoInfo, setDaoInfo] = useState<DAO | null>(null);
  const [daoService, setDaoService] = useState<DAOService | null>(null);
  const [proposals, setProposals] = useState<ProposalWithId[]>();

  const activeProposals = useMemo(() => proposals?.filter((proposal) => proposal.status === ProposalStatus.Voting), [proposals]);

  useEffect(() => {
    if (!params?.daoAddress) return goToPage('/');
    const loadDao = async () => {
      const daoService = new DAOService(api, params.daoAddress, address);
      setDaoService(daoService);
      setDaoInfo(await daoService.getInfoPopulated());
    };
    loadDao();
  }, []);

  useEffect(() => {
    if (!daoService || !address) return;
    daoService.setUserAddress(address);
  }, [address]);

  useEffect(() => {
    if (!daoInfo || !daoService) return;
    const loadProposals = async () => {
      const blockHeight = await api.derive.chain.bestNumber();
      const height = blockHeight.toJSON();
      const proposals = await Promise.all(
        Array.from({ length: daoInfo.totalProposals as number }, async (_, i) => {
          const proposal = await daoService.proposalInfo(i);
          if (!proposal) return;
          const status =
            proposal.status === ProposalStatus.Voting && height >= proposal.expires ? ProposalStatus.Expired : ProposalStatus.Voting;
          return { ...proposal, id: i, status };
        })
      );
      setProposals(proposals as ProposalWithId[]);
    };
    loadProposals();
  }, [daoInfo, daoService]);

  if (!daoInfo || !daoService) return <p>...loading</p>;

  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-5 relative">
      <div className="rounded-lg w-full flex">
        <div className="max-w-[8rem]">
          <img className="w-full rounded-full" src={daoInfo.logo} />
        </div>
        <div className="flex flex-col flex-1 py-2 px-5">
          <h1 className="font-bold text-3xl">{daoInfo.name}</h1>
          <p className="font-bold text-gray-600 text-sm">{daoInfo.address}</p>
          <div className="flex mt-5 gap-10 items-center">
            <div className="text-center font-bold">
              <p className="text-xs text-gray-500">Members</p>
              <p>{daoInfo.members}</p>
            </div>
            <span className="w-[1px] bg-gray-300 h-[80%]"></span>
            <div className="text-center font-bold">
              <p className="text-xs text-gray-500">Proposals</p>
              <p>{daoInfo.totalProposals}</p>
            </div>
            <span className="w-[1px] bg-gray-300 h-[80%]"></span>
            <div className="text-center font-bold">
              <p className="text-xs text-gray-500 w-full">Social Links</p>
              <div className="flex  items-center justify-center gap-5">
                {daoInfo.links?.website && (
                  <a href={daoInfo.links.website}>
                    <BiWorld className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
                  </a>
                )}
                {daoInfo.links?.instagram && (
                  <a href={daoInfo.links.instagram}>
                    <BsInstagram className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
                  </a>
                )}
                {daoInfo.links?.youtube && (
                  <a href={daoInfo.links.instagram}>
                    <BsYoutube className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
                  </a>
                )}
                {daoInfo.links?.discord && (
                  <a href={daoInfo.links.discord}>
                    <BsDiscord className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={() => daoService.join(`did:${Math.random().toString()}`)}>Join</Button>
        </div>
      </div>
      <div className="p-5 my-5 bg-white w-full rounded-lg">
        <p className=" text-">{daoInfo.purpose}</p>
      </div>
      <div className="grid grid-cols-3 w-full gap-5">
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">Treassury</h3>
          <div className="flex flex-col"></div>
        </div>
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">More info</h3>
        </div>
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">Check All Proposals ({daoInfo.totalProposals})</h3>
          <div className="flex flex-col"></div>
        </div>
      </div>
      <div className="w-full flex my-8 justify-between items-center">
        <h2 className="font-bold text-2xl">
          Active Proposals <span className="bg-gray-200 p-2 rounded-full">{activeProposals?.length}</span>
        </h2>
        <Button>New proposal</Button>
      </div>
      {activeProposals && <ProposalList daoService={daoService} proposalList={activeProposals} />}
    </div>
  );
};

export default DaoDetail;
