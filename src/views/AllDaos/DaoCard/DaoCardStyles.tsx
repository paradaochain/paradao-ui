import tw from 'twin.macro';

export const CardContainer = tw.div`p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 cursor-pointer`;
export const CardHeader = tw.div`flex flex-row justify-start items-start space-x-4 w-full`;
export const CardDescrip = tw.div`w-full`;
export const CardStats = tw.div`w-full flex flex-row justify-around`;
export const CardStat = tw.div`flex flex-col justify-center items-center`;
export const CardStatTitle = tw.p`text-xs font-bold text-gray-400 tracking-tight`;
export const CardStatData = tw.p`text-lg font-bold text-gray-800 tracking-wider`;
export const CardProposals = tw.div`flex flex-col w-full justify-center items-center`;
