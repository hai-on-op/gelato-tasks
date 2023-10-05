import hre from "hardhat";

const { network } = hre;

export async function forkBlock(block: number) {
  await network.provider.request({
    method: 'hardhat_reset',
    params: [{
      forking: {
        jsonRpcUrl: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
        blockNumber: block,
      },
    }]
  });
}

/**
 * Splits an array into smaller arrays (chunks) of a specified size.
 * 
 * @param arr - The original array to be split.
 * @param chunkSize - The size of each chunk.
 * @returns An array containing the smaller arrays (chunks).
 *
 * @example
 * splitIntoChunks(['a', 'b', 'c', 'e', 'f', 'g'], 2);
 * // Output: [['a', 'b'], ['c', 'e'], ['f', 'g']]
 */
export function splitIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  return arr.reduce((acc: T[][], _, index: number, array: T[]) => {
    if (index % chunkSize === 0) {
      acc.push(array.slice(index, index + chunkSize));
    }
    return acc;
  }, []);
}