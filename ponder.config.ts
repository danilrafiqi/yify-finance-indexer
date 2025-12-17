import { createConfig } from "ponder";

import { YIFYLoanManagerV2Abi } from "./abis/YIFYLoanManagerV2Abi";
import { YIFYYieldDistributorV2Abi } from "./abis/YIFYYieldDistributorV2Abi";
import { YIFYLendingPoolV2Abi } from "./abis/YIFYLendingPoolV2Abi";
import { UniversalYieldGeneratorAbi } from "./abis/UniversalYieldGeneratorAbi";

export default createConfig({
  database: {
    kind: "pglite",
    directory: "./.ponder.db",
  },
  chains: {
    anvil: {
      id: 31337,
      rpc: "http://127.0.0.1:8545",
    },
  },
  contracts: {
    YIFYLoanManagerV2: {
      chain: "anvil",
      abi: YIFYLoanManagerV2Abi,
      address: process.env.LOAN_MANAGER_ADDRESS as `0x${string}`,
      startBlock: 0,
    },
    YIFYYieldDistributorV2: {
      chain: "anvil",
      abi: YIFYYieldDistributorV2Abi,
      address: process.env.YIELD_DISTRIBUTOR_ADDRESS as `0x${string}`,
      startBlock: 0,
    },
    YIFYLendingPoolV2: {
      chain: "anvil",
      abi: YIFYLendingPoolV2Abi,
      address: process.env.LENDING_POOL_ADDRESS as `0x${string}`,
      startBlock: 0,
    },
    UniversalYieldGenerator: {
      chain: "anvil",
      abi: UniversalYieldGeneratorAbi,
      address: process.env.YIELD_GENERATOR_ADDRESS as `0x${string}`,
      startBlock: 0,
    },
  },
});
