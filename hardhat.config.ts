import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ignition";
import HardhatIgnitionEthersPlugin from "@nomicfoundation/hardhat-ignition-ethers";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

if (!process.env.SEPOLIA_PRIVATE_KEY)
  throw new Error("SEPOLIA_PRIVATE_KEY not set");

if (!process.env.SEPOLIA_RPC_URL) throw new Error("SEPOLIA_RPC_URL not set");

export default defineConfig({
  plugins: [HardhatIgnitionEthersPlugin],
  solidity: {
    version: "0.8.28",
  },

  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY!],
    },
  },
});
