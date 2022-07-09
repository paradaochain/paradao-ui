import { Web3Storage } from 'web3.storage';

const FILE_NAME = 'metadata.txt';
const WEB3_STORAGE = import.meta.env.VITE_WEB3_STORAGE;
const client = new Web3Storage({ token: WEB3_STORAGE, endpoint: new URL('https://api.web3.storage') });

export async function uploadMetada<T = unknown>(metadata: T): Promise<string> {
  const file = new File([JSON.stringify(metadata)], FILE_NAME, { type: 'text/plain' });
  const rootCid = await client.put([file]);
  return rootCid;
}

export async function getMetadata<T = unknown>(cid: string): Promise<T | null> {
  const pointer = await client.get(cid);
  const files = await pointer?.files();
  const file = files?.find((file) => file.name === FILE_NAME);
  if (!file) return null;
  const obj = await file.text();
  return obj ? JSON.parse(obj) : null;
}
