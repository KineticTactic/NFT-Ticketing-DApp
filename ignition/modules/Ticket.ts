import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TicketMarketplaceModule", (m) => {
  // 1) Deploy the NFT contract
  const ticketNFT = m.contract("TicketNFT");

  // 2) Deploy the marketplace and pass ticketNFT.address to the constructor
  const marketplace = m.contract("TicketMarketplace", [ticketNFT]);

  return { ticketNFT, marketplace };
});
