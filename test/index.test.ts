import hre from "hardhat";
import { expect } from "chai";
import { before } from "mocha";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Web3FunctionResultCallData } from "@gelatonetwork/web3-functions-sdk/*";

const { w3f } = hre;

const BLOCKS = {
  ALL_UPDETEABLE: 15103838,
  NONE_UPDETEABLE: 15195788,
}

describe.only("Oracle Update Tests", function () {
  this.timeout(0);

  let owner: SignerWithAddress;
  let oracleW3f: Web3FunctionHardhat;

  before(async function () {
    oracleW3f = w3f.get("oracle");

    [owner] = await hre.ethers.getSigners();
    oracleW3f = w3f.get("oracle");
  });

  it("Return canExec: true", async () => {
    const { result } = await oracleW3f.run();

    expect(result.canExec).to.equal(true);
  });

  it("Should try to update updeteable oracles", async () => {
    const { result } = await oracleW3f.run();

    if (result.canExec) {
      for (let i = 0; i < result.callData.length; i++) {
        const calldata = result.callData[i] as Web3FunctionResultCallData;
        
        const tx = await owner.sendTransaction({
          to: calldata.to,
          data: calldata.data,
          gasPrice: "10000000000", // TODO: can we do _?
        });
        
        console.log(await tx.wait());
      }
    }
  });

  it("Should run the batch", async () => {
    const { result } = await oracleW3f.run();

    if (result.canExec) {
      for (let i = 0; i < result.callData.length; i++) {
        const calldata = result.callData[i] as Web3FunctionResultCallData;
        
        const tx = await owner.sendTransaction({
          to: calldata.to,
          data: calldata.data,
          gasPrice: "10000000000", // TODO: can we do _?
        });
        
        console.log(await tx.wait());
      }
    }
  });
});
