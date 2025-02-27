import hre from "hardhat";
import {
  AutomateSDK,
  TriggerType,
  Web3Function,
} from "@gelatonetwork/automate-sdk";

import * as userArgs from "../web3-functions/oracle/userArgs.json";

const { ethers, w3f } = hre;

const main = async () => {
  const oracleW3f = w3f.get("oracle");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);
  const web3Function = new Web3Function(chainId, deployer);

  // Deploy Web3Function on IPFS
  console.log("Deploying Web3Function on IPFS...");
  const cid = await oracleW3f.deploy();
  console.log(`Web3Function IPFS CID: ${cid}`);

  // Create task using automate sdk
  console.log(`Creating oracle updater`);
  const { taskId, tx } = await automate.createBatchExecTask({
    name: "Web3Fn() - HAI Mainnet Update Oracle v1",
    web3FunctionHash: cid,
    web3FunctionArgs: userArgs,
    trigger: {
      type: TriggerType.TIME,
      interval: 60000, // ms (1 min)
      start: undefined,
    },
  });
  await tx.wait();
  console.log(`Task created, taskId: ${taskId} (tx hash: ${tx.hash})`);
  console.log(`> https://app.gelato.network/task/${taskId}?chainId=${chainId}`);

  // Set task specific secrets
  const secrets = oracleW3f.getSecrets();
  if (Object.keys(secrets).length > 0) {
    await web3Function.secrets.set(secrets, taskId);
    console.log(`Secrets set`);
  }
};

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
