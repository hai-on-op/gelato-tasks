import hre from "hardhat";
import { expect } from "chai";
import { before } from "mocha";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Web3FunctionResultCallData } from "@gelatonetwork/web3-functions-sdk/*";
import { forkBlock } from "./utils";
import { IAccountingEngine__factory } from "../typechain/factories";
import { BigNumber } from "ethers";

const { w3f } = hre;

let owner: SignerWithAddress;

const BLOCKS = {
  DEBT_TO_POP: {
    number: 15242000,
    timestamp: 1695907030,
  },
  NO_DEBT_TO_POP: {
    number: 15218821,
    timestamp: 0,
  },
};

describe("Debt Popper Tests", function () {
  this.timeout(0);

  let debtPopperW3f: Web3FunctionHardhat;

  before(async function () {
    debtPopperW3f = w3f.get("debt-popper");
    [owner] = await hre.ethers.getSigners();
  });

  it("Should not be executable when there is no debt to pop", async () => {
    await forkBlock(BLOCKS.NO_DEBT_TO_POP.number);

    const { result } = await debtPopperW3f.run();

    expect(result.canExec).to.equal(false);
  });

  it("Should prepare txs to pop debt from queue when possible", async () => {
    await forkBlock(BLOCKS.DEBT_TO_POP.number);

    const { result } = await debtPopperW3f.run();

    expect(result.canExec).to.equal(true);

    // this is done for typescript to know that result.canExec is true and for result.callData to exist
    if (!result.canExec) return;

    expect(result.callData.length).to.be.gt(0);

    const popDebtData =
      IAccountingEngine__factory.createInterface().encodeFunctionData(
        "popDebtFromQueue",
        [BigNumber.from(BLOCKS.DEBT_TO_POP.timestamp)]
      );

    expect((result.callData as Web3FunctionResultCallData[])[0].data).to.equal(
      popDebtData
    );
  });

  it("Should run the batch", async () => {
    await forkBlock(BLOCKS.DEBT_TO_POP.number);

    const { result } = await debtPopperW3f.run();

    // this is done for typescript to know that result.canExec is true and for result.callData to exist
    if (!result.canExec) {
      expect(false);
      return;
    }

    for (const txData of result.callData as Web3FunctionResultCallData[]) {
      const tx = await owner.sendTransaction({
        to: txData.to,
        data: txData.data,
        gasPrice: "10000000000",
      });
      await tx.wait();
    }
  });
});
