import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import { readdirSync } from "fs";
import "hardhat-deploy";
import type { HardhatUserConfig } from "hardhat/config";
import type { NetworkUserConfig } from "hardhat/types";
import { join, resolve } from "path";

try {
  readdirSync(join(__dirname, "types"));
  require("./tasks");
} catch {
  //
}

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

// const MAINNET_PK_DEPLOYER = getEnvValSafe("MAINNET_PK_DEPLOYER");

// function getEnvValSafe(key: string): string {
//   const endpoint = process.env[key];
//   if (!endpoint) throw `Missing env var ${key}`;
//   return endpoint;
// }

const chainIds = {
  hardhat: 31337,

  mainnet: 1,
  sepolia: 11155111,
  goerli: 5,

  bsc: 56,
  bscTestnet: 97,

  blastSepolia: 168587773
};

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  switch (chain) {
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed1.binance.org";
      break;
    case "bscTestnet":
      jsonRpcUrl = "https://data-seed-prebsc-1-s3.binance.org:8545/";
      break;
    case "blastSepolia":
      jsonRpcUrl = "https://sepolia.blast.io";
      break;
    default:
      jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;
  }

  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      blastSepolia: "blastSepolia"
    },
    customChains: [
      {
        network: "blastSepolia",
        chainId: 168587773,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
          browserURL: "https://testnet.blastscan.io"
        }
      }
    ]
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    sepolia: getChainConfig("sepolia"),
    goerli: getChainConfig("goerli"),
    bscTestnet: getChainConfig("bscTestnet"),
    mainnet: {
      chainId: chainIds["mainnet"],
      url: "https://mainnet.infura.io/v3/" + infuraApiKey,
      accounts: [],
    },
    bsc: {
      chainId: chainIds["bsc"],
      url: "https://bsc-dataseed1.binance.org",
      accounts: [],
      gasPrice: 3_000_000_000,
    },
    blastSepolia: getChainConfig("blastSepolia"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
};

export default config;
