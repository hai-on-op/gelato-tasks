# HAI Gelato Web3 Functions

## What are Web3 Functions?

Web3 Functions are decentralized cloud functions that work similarly to AWS Lambda or Google Cloud, just for web3. They enable developers to execute on-chain transactions based on arbitrary off-chain data (APIs / subgraphs, etc) & computation. These functions are written in Typescript, stored on IPFS and run by Gelato.

## Project Setup

1. Install project dependencies

```
yarn install
```

2. Configure your local environment:

- Copy `.env.example` to init your own `.env` file

```
cp .env.example .env
```

- Complete your `.env` file with your private settings
```
ALCHEMY_ID=
PRIVATE_KEY=
```

## Testing Web3 Functions
To test the web3 functions, using a provider fork (requires `env.ALCHEMY_ID`), you can use the following command:
```
yarn test
```

## Deploying Web3 Functions
To deploy the web3 functions (requires `env.PRIVATE_KEY`), you can use the following commands:
```
yarn create-task:oracle
yarn create-task:debt-popper
yarn create-task:state-update
```

### Deployed Web3 Functions
#### Optimism Goerli
- Oracle updater: 
  - IPFS CID: `QmeQMLxY2hJYzypn5UcaZaVfWx16dc6banxGX1P7pCPMJu`
  - Task ID: `0x3f9cf242e5ee07ac1dfbffe4e774f56b6c703a6106c8f30ce880417a09e84a29`
  - Deployment Tx: `0x1a7e20a6c8645e5c774652fcf45be378d61da1637b82e04a2fc9376ef0f19c06`
- Debt popper:
  - IPFS CID: `QmerskF12CsftbBMFsbwgtF18ibrhxNPoVne1Zmvhqmavu`
  - Task ID: `0x66848342b1d9f7678352fbcc9cfa31318557963116c0e0bfc6906b2b49405ca5`
  - Deployment Tx: `0xa29e65e40459a83fdfe3cf3f200f375ceae65d3b05dc5db067bc933b1bc055dc`
- State updater:
  - IPFS CID: `Qmaw59KW6zJGLKJbmAC4W1HX68adEbfzKKRi36UkZdbgja`
  - Task ID: `0xc68ae72b8ace3c2ec3f8f4fac6b41f578a3ac3d49d1d5f4916ffcbdbcc88254f`
  - Deployment Tx: `0xce198c626965a4910ab2cd9716dc3527c9da552d57a11f835cffc48c85b1f23f`