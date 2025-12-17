import { createConfig } from "ponder";
import path from "node:path";
import fs from "node:fs";

import { YIFYLoanManagerV2Abi } from "./abis/YIFYLoanManagerV2Abi";
import { YIFYYieldDistributorV2Abi } from "./abis/YIFYYieldDistributorV2Abi";
import { YIFYLendingPoolV2Abi } from "./abis/YIFYLendingPoolV2Abi";
import { UniversalYieldGeneratorAbi } from "./abis/UniversalYieldGeneratorAbi";

const DEPLOYMENT_DIR = path.resolve(__dirname, "./deployments");

function getContractConfig(chainId: number, contractName: string, envAddress: string | undefined, defaultStartBlock: number) {
  let address = envAddress as `0x${string}`;
  let startBlock = defaultStartBlock;

  try {
    const deploymentFile = path.join(DEPLOYMENT_DIR, `addresses-${chainId}.json`);
    if (fs.existsSync(deploymentFile)) {
      const data = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
      if (data[contractName]) {
        // Prefer JSON address if available? User logic seemed to prefer env vars in ponder.config usually.
        // But for startBlock we want the JSON value.
        // Let's stick to using ENV for address (as user set it up) but JSON for startBlock.
        if (data.deploymentBlock) {
          startBlock = Number(data.deploymentBlock);
          console.log("Loaded deployment info for chain", chainId, "deploymentBlock", startBlock);
        }
      }
    }
  } catch (e) {
    console.warn("Failed to load deployment info for chain", chainId, e);
  }

  return { address, startBlock };
}

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
        anvil: getContractConfig(31337, "loanManager", process.env.LOAN_MANAGER_ADDRESS, 0),
        lisk: getContractConfig(4202, "loanManager", process.env.LOAN_MANAGER_ADDRESS_LISK, 0),
        base: getContractConfig(84532, "loanManager", process.env.LOAN_MANAGER_ADDRESS_BASE, 35102094),
        optimism: getContractConfig(11155420, "loanManager", process.env.LOAN_MANAGER_ADDRESS_OP, 0),
        sepolia: getContractConfig(11155111, "loanManager", process.env.LOAN_MANAGER_ADDRESS_SEPOLIA, 0),
      },
    },
    YIFYYieldDistributorV2: {
      abi: YIFYYieldDistributorV2Abi,
      chain: {
        anvil: getContractConfig(31337, "yieldDistributor", process.env.YIELD_DISTRIBUTOR_ADDRESS, 0),
        lisk: getContractConfig(4202, "yieldDistributor", process.env.YIELD_DISTRIBUTOR_ADDRESS_LISK, 0),
        base: getContractConfig(84532, "yieldDistributor", process.env.YIELD_DISTRIBUTOR_ADDRESS_BASE, 35102094),
        optimism: getContractConfig(11155420, "yieldDistributor", process.env.YIELD_DISTRIBUTOR_ADDRESS_OP, 0),
        sepolia: getContractConfig(11155111, "yieldDistributor", process.env.YIELD_DISTRIBUTOR_ADDRESS_SEPOLIA, 0),
      },
    },
    YIFYLendingPoolV2: {
      abi: YIFYLendingPoolV2Abi,
      chain: {
        anvil: getContractConfig(31337, "lendingPool", process.env.LENDING_POOL_ADDRESS, 0),
        lisk: getContractConfig(4202, "lendingPool", process.env.LENDING_POOL_ADDRESS_LISK, 0),
        base: getContractConfig(84532, "lendingPool", process.env.LENDING_POOL_ADDRESS_BASE, 35102094),
        optimism: getContractConfig(11155420, "lendingPool", process.env.LENDING_POOL_ADDRESS_OP, 0),
        sepolia: getContractConfig(11155111, "lendingPool", process.env.LENDING_POOL_ADDRESS_SEPOLIA, 0),
      },
    },
    UniversalYieldGenerator: {
      abi: UniversalYieldGeneratorAbi,
      chain: {
        anvil: getContractConfig(31337, "yieldGenerator", process.env.YIELD_GENERATOR_ADDRESS, 0),
        lisk: getContractConfig(4202, "yieldGenerator", process.env.YIELD_GENERATOR_ADDRESS_LISK, 0),
        base: getContractConfig(84532, "yieldGenerator", process.env.YIELD_GENERATOR_ADDRESS_BASE, 35102094),
        optimism: getContractConfig(11155420, "yieldGenerator", process.env.YIELD_GENERATOR_ADDRESS_OP, 0),
        sepolia: getContractConfig(11155111, "yieldGenerator", process.env.YIELD_GENERATOR_ADDRESS_SEPOLIA, 0),
      },
    },
  },
});
