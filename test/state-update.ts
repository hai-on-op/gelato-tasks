import hre from "hardhat";
import { expect } from "chai";
import { before } from "mocha";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import { Web3FunctionResultCallData } from "@gelatonetwork/web3-functions-sdk/*";
import { forkBlock } from "./utils";
import { IPIDRateSetter__factory } from "../typechain/factories";
import { IAccountingEngine__factory } from "../typechain/factories";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { w3f } = hre;

const BLOCKS = {
  AUCTION_DEBT: 15512682,
  UPDATE_RATE_AND_AUCTION_DEBT: 15510000,
  NONE_UPDETEABLE: 13592420,
};

let owner: SignerWithAddress;

describe("State Update Tests", function () {
  this.timeout(0);
  let stateUpdateW3f: Web3FunctionHardhat;

  before(async function () {
    stateUpdateW3f = w3f.get("state-update");
    [owner] = await hre.ethers.getSigners();
  });

  it("Should be executable when there it should update the state", async () => {
    await forkBlock(BLOCKS.AUCTION_DEBT);

    const { result } = await stateUpdateW3f.run();

    expect(result.canExec).to.equal(true);
  });

  it("Should prepare txs when it has single state updates", async () => {
    await forkBlock(BLOCKS.AUCTION_DEBT);

    const { result } = await stateUpdateW3f.run();

    expect(result.canExec).to.equal(true);
    // this is done for typescript to know that result.canExec is true and for result.callData to exist
    if (!result.canExec) return;

    expect(result.callData[0]).to.be.deep.equal({
      to: stateUpdateW3f.getUserArgs().accountingEngineAddress as string,
      data: IAccountingEngine__factory.createInterface().encodeFunctionData(
        "auctionDebt"
      ),
    });
  });

  it("Should prepare txs when it has multiple state updates", async () => {
    await forkBlock(BLOCKS.UPDATE_RATE_AND_AUCTION_DEBT);

    const { result } = await stateUpdateW3f.run();

    expect(result.canExec).to.equal(true);
    // this is done for typescript to know that result.canExec is true and for result.callData to exist
    if (!result.canExec) return;

    expect(result.callData[0]).to.be.deep.equal({
      to: stateUpdateW3f.getUserArgs().pidRateSetterAddress as string,
      data: IPIDRateSetter__factory.createInterface().encodeFunctionData(
        "updateRate"
      ),
    });
    expect(result.callData[1]).to.be.deep.equal({
      to: stateUpdateW3f.getUserArgs().accountingEngineAddress as string,
      data: IAccountingEngine__factory.createInterface().encodeFunctionData(
        "auctionDebt"
      ),
    });
  });

  it("Should not be executable when there is no state to update", async () => {
    await forkBlock(BLOCKS.NONE_UPDETEABLE);

    const { result } = await stateUpdateW3f.run();

    expect(result.canExec).to.equal(false);
  });

  it("Should run the batch", async () => {
    await forkBlock(BLOCKS.UPDATE_RATE_AND_AUCTION_DEBT);
    const { result } = await stateUpdateW3f.run();

    // this is done for typescript to know that result.canExec is true and for result.callData to exist
    if (!result.canExec) {
      expect(false);
      return;
    }

    for (const txData of result.callData as Web3FunctionResultCallData[]) {
      const tx = await owner.sendTransaction({
        to: txData.to,
        data: txData.data,
        gasPrice: "100000000",
      });

      await tx.wait();
    }
  });
});
