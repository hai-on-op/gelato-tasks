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

#### Optimism Sepolia

- Oracle updater:
  - IPFS CID: `QmbVxFZY686uHn7XF8t5SekoaUfAngfeQZLGieAqBjRWo3`
  - Task ID: `0x29f278c875d9a6514789e44a4bd16275cd4c81ea97b217977a54ae370e4f60ce`
  - Deployment Tx: `0x518122963289f8e0aa5b25d0c9cfb69f9e2d84c01df3cb3fdd5618b73780608c`
- Debt popper:
  - IPFS CID: `QmZzsj9vKHsHcyPueg24JLUyXxpJ7ZCLq7F6A5fTvr4NYE`
  - Task ID: `0x6f20e28573a51ff66c8262d76bbc104ef9828ef54dc1eef9118f046ccf9f59b1`
  - Deployment Tx: `0x33b528fa9837bc9aa0597f120de53e3fa886c51c84ed59bf7df47f382fcbeeda`
- State updater:
  - IPFS CID: `QmRYExCRxZCGXEtruFLZkKD6MneN3Ly4KAjWFnB5rdctMG`
  - Task ID: `0x42309fa568048ff6a2c37166cef4c86bab9fa9104bd19f9d073fbc03d56903ce`
  - Deployment Tx: `0xdc37b197d0a2a56a2e285112cdd7461cd47210b2a219edcc37193f78706e0ad8`

#### Optimism Mainnet

- Oracle updater:
  - IPFS CID: `QmbVxFZY686uHn7XF8t5SekoaUfAngfeQZLGieAqBjRWo3`
  - Task ID: `0x7e650a45da3c00be3176deb94d0cecb5499df340452d54d671522720781d241b`
  - Deployment Tx: `0xa8849f91f2311b55ac53d7c425adbd4cd9970434c09c0938a42ffd783abc5b65`
- Debt popper:
  - IPFS CID: `QmZzsj9vKHsHcyPueg24JLUyXxpJ7ZCLq7F6A5fTvr4NYE`
  - Task ID: `0xdf46115725041eed1446d13de60ba8abb758489b57a51fcc6c26f61888fc05c3`
  - Deployment Tx: `0xa4ee5beca3c7b49f65d43a4bb2bbf4a33c2284f0560f85b1e1d85d04dc5c20a4`
- State updater:
  - IPFS CID: `QmRYExCRxZCGXEtruFLZkKD6MneN3Ly4KAjWFnB5rdctMG`
  - Task ID: `0x999e021a6ba777c2e500808a9041320893f6aa90264a22196171d77cec0a43aa`
  - Deployment Tx: `0x991a38003bf8503048ba8079f0240ba05e9736c180c84219f464f7367ca53244`

#### Optimism Goerli [DEPRECATED]

- Oracle updater:
  - IPFS CID: `QmRsPRdzYcpmY66b2oYYPmEsWynQys7mdgy6ccRH6v2jiM`
  - Task ID: `0x6f9d0fd1007ac401def003be869c895d29c19832d1fd663cd82900150230479d`
  - Deployment Tx: `0xb2a4f0818aa03ce54e8ec3e703ee599ef27b44540239bda3106cfe26f50f75f5`
- Debt popper:
  - IPFS CID: `QmerskF12CsftbBMFsbwgtF18ibrhxNPoVne1Zmvhqmavu`
  - Task ID: `0x66848342b1d9f7678352fbcc9cfa31318557963116c0e0bfc6906b2b49405ca5`
  - Deployment Tx: `0xa29e65e40459a83fdfe3cf3f200f375ceae65d3b05dc5db067bc933b1bc055dc`
- State updater:
  - IPFS CID: `Qmaw59KW6zJGLKJbmAC4W1HX68adEbfzKKRi36UkZdbgja`
  - Task ID: `0xc68ae72b8ace3c2ec3f8f4fac6b41f578a3ac3d49d1d5f4916ffcbdbcc88254f`
  - Deployment Tx: `0xce198c626965a4910ab2cd9716dc3527c9da552d57a11f835cffc48c85b1f23f`
