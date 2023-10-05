import {
  Web3Function,
  Web3FunctionContext,
  Web3FunctionResultCallData,
} from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";
import { IPIDRateSetter__factory } from "../../typechain/factories";
import { IAccountingEngine__factory } from "../../typechain/factories";
import BatchStateChecker from "../../artifacts/contracts/BatchStateChecker.sol/BatchStateChecker.json";

interface StateData {
  shouldUpdateRate: boolean;
  shouldAuctionDebt: boolean;
  shouldAuctionSurplus: boolean;
  shouldTransferSurplus: boolean;
}

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();

  // Encode the input data
  const inputData = ethers.utils.defaultAbiCoder.encode(
    ["address", "address"],
    [userArgs.accountingEngineAddress, userArgs.pidRateSetterAddress]
  );

  // Generate payload from input data
  const payload = BatchStateChecker.bytecode.concat(inputData.slice(2));

  // Call the deployment transaction with the payload
  const returnedData = await provider.call({ data: payload });

  // Parse the returned value to the struct type in order
  const decoded = ethers.utils.defaultAbiCoder.decode(
    [
      `tuple(
        bool shouldUpdateRate,
        bool shouldAuctionDebt,
        bool shouldAuctionSurplus,
        bool shouldTransferSurplus
      )`,
    ],
    returnedData
  )[0] as StateData;

  const txs: Web3FunctionResultCallData[] = [];

  if (decoded.shouldUpdateRate === true) {
    txs.push({
      to: userArgs.pidRateSetterAddress as string,
      data: IPIDRateSetter__factory.createInterface().encodeFunctionData(
        "updateRate"
      ),
    });
  }

  if (decoded.shouldAuctionDebt === true) {
    txs.push({
      to: userArgs.accountingEngineAddress as string,
      data: IAccountingEngine__factory.createInterface().encodeFunctionData(
        "auctionDebt"
      ),
    });
  }

  if (decoded.shouldAuctionSurplus === true) {
    txs.push({
      to: userArgs.accountingEngineAddress as string,
      data: IAccountingEngine__factory.createInterface().encodeFunctionData(
        "auctionSurplus"
      ),
    });
  }

  if (decoded.shouldTransferSurplus === true) {
    txs.push({
      to: userArgs.accountingEngineAddress as string,
      data: IAccountingEngine__factory.createInterface().encodeFunctionData(
        "transferExtraSurplus"
      ),
    });
  }

  // Return the transaction requests if there are any
  if (txs.length) {
    return {
      canExec: true,
      callData: txs,
    };
  }

  return {
    canExec: false,
    message: "No state update to execute",
  };
});
