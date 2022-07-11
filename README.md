# ParaDao UI
A web app to create Daos onto a set of smart contracts on a parachain, and do cool things with them

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

