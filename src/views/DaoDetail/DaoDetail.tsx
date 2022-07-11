import Button from '@components/Button/Button';
import React, { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ProposalList from '@components/ProposalList/ProposalList';
import { ProposalWithId } from '@interfaces/Proposal';
import { useLocation, useRoute } from 'wouter';
import { DAOService } from '@services/dao';
import ZeitgeistService from '@services/zeitgeist';
import { usePolkadot } from '@context/polkadot';
import DAO from '@interfaces/dao';
import { HorizontalSpinner, WhiteSpinner } from '@components/Spinner/Spinner';
import { ProposalStatus } from '@interfaces/ProposalStatus';
import NewProposalModal from '@components/Modal/NewProposalModal';
import NewPMModal from '@components/Modal/NewPMModal';
import daoLogo from '../../components/icons/paradao-icon.svg';
import SocialMediaIcons from './SocialMediaIcons/SocialMediaIcons';

const DaoDetail: React.FC = () => {
  const [, params] = useRoute('/dao/:daoAddress');
  const [, goToPage] = useLocation();
  const { api, address } = usePolkadot();
  const [daoInfo, setDaoInfo] = useState<DAO | null>(null);
  const [daoService, setDaoService] = useState<DAOService | null>(null);
  const [proposals, setProposals] = useState<ProposalWithId[]>();
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [tsDaoChanged, setTsDaoChanged] = useState<number>(Date.now());
  const [addModalStatus, setAddModalStatus] = useState(false);
  const [addPMModalStatus, setAddPMModalStatus] = useState(false);

  const activeProposals = useMemo(() => proposals?.filter((proposal) => proposal.status === ProposalStatus.Voting), [proposals]);
  const zg_ws = import.meta.env.VITE_ZG_WS_URL;

  useEffect(() => {
    if (!params?.daoAddress) return goToPage('/');
    const loadDao = async () => {
      const daoService = new DAOService(api, params.daoAddress, address);
      setDaoService(daoService);
      const dao = await daoService.getInfoPopulated();
      setDaoInfo(dao);
    };
    loadDao();
  }, [tsDaoChanged]);

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

  if (!daoInfo || !daoService)
    return (
      <div tw="flex w-full h-full justify-center items-center">
        <p>
          ...loading <HorizontalSpinner />
        </p>
      </div>
    );

  const handleJoin = () => {
    const callJoin = async () => {
      setIsJoining(true);
      setTimeout(() => {
        setIsJoining(false);
        toast.error('Could not join now :( Try again?');
      }, 120000);
      toast('Good things come to ppl who wait... Joining... :)');
      try {
        const confirm = await daoService.join(`did:${Math.random().toString()}`);
        setIsJoining(false);
        toast.success('Successfully joined!');
        setTsDaoChanged(Date.now());
      } catch (e) {
        // display err
        console.log(e);
        setIsJoining(false);
        toast.error(`Could not join ${e}`);
      }
    };
    callJoin();
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-5 relative">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="rounded-lg w-full flex">
        <div className="max-w-[8rem]">
          <img className="w-full rounded-full" src={daoInfo.logo ? daoInfo.logo : daoLogo} />
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
            {daoInfo.links && (
              <>
                <span className="w-[1px] bg-gray-300 h-[80%]"></span>
                <div className="text-center font-bold">
                  <p className="text-xs text-gray-500 w-full">Social Links</p>
                  <SocialMediaIcons links={daoInfo.links as Record<string, string>} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleJoin} disabled={isJoining || !address}>
            {isJoining ? 'Joining...' : 'Join'}
            {isJoining && <WhiteSpinner tw="ml-1" />}
          </Button>
        </div>
      </div>
      <div className="p-5 my-5 bg-white w-full rounded-lg">
        <p className=" text-">{daoInfo.purpose}</p>
      </div>
      <div className="grid grid-cols-3 w-full gap-5">
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">Treassury</h3>
          <h3 className="font-bold text-md text-center">{daoInfo.funds} Para</h3>
          <div className="flex flex-col"></div>
        </div>
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">All Prediction Markets</h3>
          <h3 className="font-bold text-md text-center">{daoInfo.totalPms}</h3>
        </div>
        <div className="bg-white rounded-md p-3">
          <h3 className="font-bold text-xl text-center">All Proposals</h3>
          <h3 className="font-bold text-md text-center">{daoInfo.totalProposals}</h3>
          <div className="flex flex-col"></div>
        </div>
      </div>
      <div className="w-full flex my-8 justify-between items-center">
        <h2 className="font-bold text-2xl">
          Engagement <span className="bg-gray-200 p-2 rounded-full">{activeProposals?.length}</span>
        </h2>
        <Button onClick={() => setAddPMModalStatus(true)}>New prediction market</Button>
        <Button onClick={() => setAddModalStatus(true)}>New proposal</Button>
      </div>
      {activeProposals && <ProposalList daoService={daoService} proposalList={activeProposals} />}
      <NewProposalModal status={addModalStatus} closeModal={() => setAddModalStatus(false)} daoService={daoService} />
      <NewPMModal status={addPMModalStatus} closeModal={() => setAddPMModalStatus(false)} />
    </div>
  );
};

export default DaoDetail;
