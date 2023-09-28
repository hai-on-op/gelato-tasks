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