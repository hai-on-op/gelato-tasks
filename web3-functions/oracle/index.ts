import {
  Web3Function,
  Web3FunctionContext,
  Web3FunctionResultCallData,
} from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";
import {
  IDelayedOracle__factory,
  IOracleRelayer__factory,
} from "../../typechain/factories";
import BatchOracleChecker from "../../artifacts/contracts/BatchOracleChecker.sol/BatchOracleChecker.json";

interface SafeData {
  cType: string;
  oracle: string;
  shouldUpdate: boolean;
}

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();

  // Encode the input data
  const inputData = ethers.utils.defaultAbiCoder.encode(
    ["address", "bytes32[]"],
    [userArgs.oracleRelayerAddress, userArgs.collateralTypes]
  );

  // Generate payload from input data
  const payload = BatchOracleChecker.bytecode.concat(inputData.slice(2));

  // Call the deployment transaction with the payload
  const returnedData = await provider.call({ data: payload });

  // Parse the returned value to the struct type in order
  const decoded = ethers.utils.defaultAbiCoder.decode(
    [`tuple(bytes32 cType, address oracle, bool shouldUpdate)[]`],
    returnedData
  )[0] as SafeData[];

  const txs = decoded
    // Filter out oracles that don't need to be updated
    .filter(({ shouldUpdate }) => shouldUpdate)
    // Map the remaining oracles to update the oracle result and relayer's collateral price
    .reduce((acc, { oracle, cType }) => [
      ...acc,
      {
        to: oracle,
        data: IDelayedOracle__factory.createInterface().encodeFunctionData(
          "updateResult"
        ),
      },
      {
        to: userArgs.oracleRelayerAddress as string,
        data: IOracleRelayer__factory.createInterface().encodeFunctionData(
          "updateCollateralPrice",
          [cType]
        ),
      }
    ], [] as Web3FunctionResultCallData[]);

  // Return the transaction requests if there are any
  if (txs.length) {
    return {
      canExec: true,
      callData: txs,
    };
  }

  return {
    canExec: false,
    message: "No oracles to update",
  };
});
