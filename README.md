# ParaDao UI

A web app to create Daos onto a set of smart contracts on a parachain, and do cool things with them
<img width="1786" alt="Screenshot 2022-07-11 at 11 46 01 AM" src="https://user-images.githubusercontent.com/18553484/178194081-310d8bb4-9330-46a6-8c26-d202a6687f47.png">

To run locally with local chains found in https://github.com/paradaochain/chain
Please run the docker file and do:
`yarn deploy` in the `chain/js-app` directory. This will store the factory address in `chain/js-app/.tmp-factory-addredss`.

Then navigate back to this repo to set your .env file with

```
VITE_WEB3_STORAGE=<ipfs storage provider key>
VITE_FACTORY_ADDR=<factory address>
VITE_WS_URL=ws://127.0.0.1:9944
VITE_ZG_WS_URL=ws://127.0.0.1:8844
```

Please let us know if you need ipfs storage key email-me@belsy.space

Finally do

```
yarn install
yarn dev

```

## Try it out!

1. Please fund yourself with paradao parachain tokens (to create, join, propose and vote) with `wss:://paradao.space/paradao`
2. Also fund youself with Zeitgeist dev tokens (to create prediction market and buy OST) with `wss://paradao.space/zg`
3. Head over to paradao.space 🚀

_Note: the Paradao Parachain has a block time of 12 seconds, please be patient_
_Note: if you made the proposal, your vote has been counted and you cannot use the same account to vote again_
