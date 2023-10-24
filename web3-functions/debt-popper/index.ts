import {
  Web3Function,
  Web3FunctionContext,
  Web3FunctionResultCallData,
} from "@gelatonetwork/web3-functions-sdk";
import { IAccountingEngine } from "../../typechain";
import {
  PopDebtFromQueueEvent,
  PushDebtToQueueEvent,
} from "../../typechain/IAccountingEngine";
import { IAccountingEngine__factory } from "../../typechain/factories";
import { BigNumber } from "ethers";

// record string to boolean
interface IsPoppedTimestamp {
  [key: string]: boolean;
}

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();

  const accountingEngine = IAccountingEngine__factory.connect(
    userArgs.accountingEngineAddress as string,
    provider
  );

  const txs = await getTxRequests(accountingEngine);

  // Return the transaction requests if there are any
  if (txs.length) {
    return {
      canExec: true,
      callData: txs,
    };
  }

  return {
    canExec: false,
    message: "No debt to pop",
  };
});

// find unpoped push events
const getTxRequests = async (
  accountingEngine: IAccountingEngine
): Promise<Web3FunctionResultCallData[]> => {
  const popDebtDelay = (await accountingEngine.params()).popDebtDelay;

  const pushEvents = (await accountingEngine.queryFilter(
    accountingEngine.filters.PushDebtToQueue()
  )) as PushDebtToQueueEvent[];

  const popEvents = (await accountingEngine.queryFilter(
    accountingEngine.filters.PopDebtFromQueue()
  )) as PopDebtFromQueueEvent[];

  const poppedTimestamps = popEvents.reduce(
    (obj: IsPoppedTimestamp, event: PopDebtFromQueueEvent) => {
      return { ...obj, [event.args._timestamp.toString()]: true };
    },
    {} as IsPoppedTimestamp
  );

  const unresolvedEvents = pushEvents.filter(
    (pushEvent: PushDebtToQueueEvent) =>
      !poppedTimestamps[pushEvent.args._timestamp.toString()] &&
      BigNumber.from(pushEvent.args._timestamp)
        .add(popDebtDelay)
        .lt(Math.floor(Date.now() / 1000))
  );

  if (!unresolvedEvents.length) return [];

  const txRequests = unresolvedEvents.map((event: PopDebtFromQueueEvent) => {
    return accountingEngine.populateTransaction.popDebtFromQueue(
      event.args._timestamp.toString()
    ) as Promise<Web3FunctionResultCallData>;
  });

  return Promise.all(txRequests);
};
