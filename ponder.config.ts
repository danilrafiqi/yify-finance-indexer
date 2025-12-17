import { createConfig } from "ponder";

import { YIFYLoanManagerV2Abi } from "./abis/YIFYLoanManagerV2Abi";
import { YIFYYieldDistributorV2Abi } from "./abis/YIFYYieldDistributorV2Abi";
import { YIFYLendingPoolV2Abi } from "./abis/YIFYLendingPoolV2Abi";
import { UniversalYieldGeneratorAbi } from "./abis/UniversalYieldGeneratorAbi";

export default createConfig({
  database: process.env.DATABASE_URL
    ? {
      kind: "postgres",
      connectionString: process.env.DATABASE_URL,
    }
    : {
      kind: "pglite",
      directory: "./.ponder.db",
    },
  chains: {
    anvil: {
      id: 31337,
      rpc: "http://127.0.0.1:8545",
    },
    lisk: {
      id: 4202,
      rpc: process.env.LISK_SEPOLIA_RPC_URL ?? "https://rpc.sepolia-api.lisk.com",
    },
    base: {
      id: 84532,
      rpc: process.env.BASE_SEPOLIA_RPC_URL ?? "https://sepolia.base.org",
    },
    optimism: {
      id: 11155420,
      rpc: process.env.OP_SEPOLIA_RPC_URL ?? "https://sepolia.optimism.io",
    },
    sepolia: {
      id: 11155111,
      rpc: process.env.SEPOLIA_RPC_URL ?? "https://eth-sepolia.g.alchemy.com/v2/demo",
    },
  },
  contracts: {
    YIFYLoanManagerV2: {
      abi: YIFYLoanManagerV2Abi,
      chain: {
        anvil: { address: process.env.LOAN_MANAGER_ADDRESS as `0x${string}` },
        lisk: { address: process.env.LOAN_MANAGER_ADDRESS_LISK as `0x${string}` },
        base: { address: process.env.LOAN_MANAGER_ADDRESS_BASE as `0x${string}` },
        optimism: { address: process.env.LOAN_MANAGER_ADDRESS_OP as `0x${string}` },
        sepolia: { address: process.env.LOAN_MANAGER_ADDRESS_SEPOLIA as `0x${string}` },
      },
      startBlock: 0,
    },
    YIFYYieldDistributorV2: {
      abi: YIFYYieldDistributorV2Abi,
      chain: {
        anvil: { address: process.env.YIELD_DISTRIBUTOR_ADDRESS as `0x${string}` },
        lisk: { address: process.env.YIELD_DISTRIBUTOR_ADDRESS_LISK as `0x${string}` },
        base: { address: process.env.YIELD_DISTRIBUTOR_ADDRESS_BASE as `0x${string}` },
        optimism: { address: process.env.YIELD_DISTRIBUTOR_ADDRESS_OP as `0x${string}` },
        sepolia: { address: process.env.YIELD_DISTRIBUTOR_ADDRESS_SEPOLIA as `0x${string}` },
      },
      startBlock: 0,
    },
    YIFYLendingPoolV2: {
      abi: YIFYLendingPoolV2Abi,
      chain: {
        anvil: { address: process.env.LENDING_POOL_ADDRESS as `0x${string}` },
        lisk: { address: process.env.LENDING_POOL_ADDRESS_LISK as `0x${string}` },
        base: { address: process.env.LENDING_POOL_ADDRESS_BASE as `0x${string}` },
        optimism: { address: process.env.LENDING_POOL_ADDRESS_OP as `0x${string}` },
        sepolia: { address: process.env.LENDING_POOL_ADDRESS_SEPOLIA as `0x${string}` },
      },
      startBlock: 0,
    },
    UniversalYieldGenerator: {
      abi: UniversalYieldGeneratorAbi,
      chain: {
        anvil: { address: process.env.YIELD_GENERATOR_ADDRESS as `0x${string}` },
        lisk: { address: process.env.YIELD_GENERATOR_ADDRESS_LISK as `0x${string}` },
        base: { address: process.env.YIELD_GENERATOR_ADDRESS_BASE as `0x${string}` },
        optimism: { address: process.env.YIELD_GENERATOR_ADDRESS_OP as `0x${string}` },
        sepolia: { address: process.env.YIELD_GENERATOR_ADDRESS_SEPOLIA as `0x${string}` },
      },
      startBlock: 0,
    },
  },
});
