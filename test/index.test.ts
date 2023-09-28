import hre from "hardhat";
import { expect } from "chai";
import { before } from "mocha";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Web3FunctionResultCallData } from "@gelatonetwork/web3-functions-sdk/*";
import { forkBlock } from "./utils";
import { IDelayedOracle__factory } from "../typechain";

const { w3f } = hre;

const BLOCKS = {
  ALL_UPDETEABLE: 15103838,
  NONE_UPDETEABLE: 15195788,
}

describe("Oracle Update Tests", function () {
  this.timeout(0);

  let owner: SignerWithAddress;
  let oracleW3f: Web3FunctionHardhat;

  before(async function () {
    oracleW3f = w3f.get("oracle");

    [owner] = await hre.ethers.getSigners();
    oracleW3f = w3f.get("oracle");
  });

  it("Should not be executable when there is no oracles to update", async () => {
    await forkBlock(BLOCKS.NONE_UPDETEABLE);
    
    const { result } = await oracleW3f.run();

    expect(result.canExec).to.equal(false);
  });

  it("Should prepare txs to update oracles when there are any to update", async () => {
    const updateResultData = IDelayedOracle__factory.createInterface().encodeFunctionData('updateResult');
    await forkBlock(BLOCKS.ALL_UPDETEABLE);
    
    const { result } = await oracleW3f.run();

    expect(result.canExec).to.equal(true);
    
    // this is done for typescript to know that result.canExec is true and for result.callData to exist
    if (!result.canExec) return;

    expect(result.callData.length).to.be.gt(0);

    (result.callData as Web3FunctionResultCallData[]).forEach(({data}) => {
      expect(data).to.equal(updateResultData, "callData should be `updateResult` for all oracles");
    });
  });
});
