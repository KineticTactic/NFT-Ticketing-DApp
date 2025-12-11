import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const network = process.argv[2]; 

if (!network) {
  console.error("❌ No network supplied. Usage: tsx write-frontend-config.ts <network>");
  process.exit(1);
}

if (!["local", "sepolia"].includes(network)) {
  console.error("❌ Network not supported. Only supports 'local' and 'sepolia'.");
  process.exit(1);
}

const FRONTEND_PATH = path.resolve(__dirname, "../frontend/src/contractConfig.ts");

// CHANGE THESE if you use a different contract names
const NFT_ARTIFACT = path.resolve(__dirname, "../artifacts/contracts/TicketNFT.sol/TicketNFT.json");
const MARKET_ARTIFACT = path.resolve(__dirname, "../artifacts/contracts/TicketMarketplace.sol/TicketMarketplace.json");

const DEPLOY_ADDRESSES = path.resolve(__dirname, `../ignition/deployments/chain-${network == "local" ? "31337" : "11155111"}/deployed_addresses.json`);

function loadJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function main() {
  console.log("🔄 Generating frontend contract config...");

  // ABIs
  const nftArtifact = loadJSON(NFT_ARTIFACT);
  const marketArtifact = loadJSON(MARKET_ARTIFACT);

  // Addresses from Ignition deploy metadata
  const deployedAddresses = loadJSON(DEPLOY_ADDRESSES);

  const nftAddress = deployedAddresses["TicketMarketplaceModule#TicketNFT"];
  const marketAddress = deployedAddresses["TicketMarketplaceModule#TicketMarketplace"];

  const fileContent =
    `// AUTO-GENERATED — DO NOT EDIT  
export const NFT_ADDRESS = "${nftAddress}";
export const MARKET_ADDRESS = "${marketAddress}";

export const NFT_ABI = ${JSON.stringify(nftArtifact.abi, null, 2)};
export const MARKET_ABI = ${JSON.stringify(marketArtifact.abi, null, 2)};
`;

  fs.writeFileSync(FRONTEND_PATH, fileContent);
  console.log("✨ Frontend config written to:", FRONTEND_PATH);
}

main();
