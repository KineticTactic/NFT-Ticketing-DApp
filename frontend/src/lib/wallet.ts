import { ethers } from "ethers";
import {
  NFT_ABI,
  MARKET_ABI,
  NFT_ADDRESS,
  MARKET_ADDRESS,
} from "../contractConfig";

export async function getProviderAndSigner() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
}

export async function fetchAllListings() {
  if (!window.ethereum) return [];

  const provider = new ethers.BrowserProvider(window.ethereum);

  const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
  const marketContract = new ethers.Contract(
    MARKET_ADDRESS,
    MARKET_ABI,
    provider
  );

  // get the highest minted tokenId
  const nextId: bigint = await nftContract.nextId();
  const maxId = Number(nextId) - 1;

  const listings = [];

  for (let tid = 1; tid <= maxId; tid++) {
    try {
      const listing = await marketContract.listings(tid);
      // listing = [seller, price, active] (bigint for price)

      if (listing.active) {
        listings.push({
          tokenId: tid,
          seller: listing.seller,
          price: Number(ethers.formatEther(listing.price)),
        });
      }
    } catch (err) {
      console.error(`Error fetching listing for token ${tid}`, err);
    }
  }

  return listings;
}

export async function fetchOwnedTokens(address: string) {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);

  const ids: bigint[] = await nftContract.tokensOfOwner(address);
  const normalized = ids.map((b: bigint) => Number(b));
  return normalized;
}

export async function listForSale(tid: number, priceEth: string) {
  if (!window.ethereum) return;
  const { signer } = await getProviderAndSigner();

  const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
  const marketContract = new ethers.Contract(
    MARKET_ADDRESS,
    MARKET_ABI,
    signer
  );

  try {
    // ensure signer owns the token
    const owner = await nftContract.ownerOf(tid);
    const signerAddr = await signer.getAddress();
    if (owner.toLowerCase() !== signerAddr.toLowerCase()) {
      alert(
        "You are not the owner of this token. Switch to the owner account in MetaMask."
      );
      return;
    }

    // approve marketplace if needed
    const approved = await nftContract.getApproved(tid);
    if (approved.toLowerCase() !== MARKET_ADDRESS.toLowerCase()) {
      const approveTx = await nftContract.approve(MARKET_ADDRESS, tid);
      console.log("approve tx hash:", approveTx.hash);
      await approveTx.wait();
    }

    // parseEther returns bigint in ethers v6
    const priceWei = ethers.parseEther(priceEth);

    // Call marketplace list function - adjust name if your ABI differs
    // this example uses list(address nft, uint256 tokenId, uint256 price)
    const tx = await marketContract.listTicket(tid, priceWei);
    console.log("list tx hash:", tx.hash);
    await tx.wait();
  } catch (err: any) {
    console.error("list error:", err);
    alert("Listing failed: " + (err?.message || JSON.stringify(err)));
  }
}

export async function buyTicket(tid: number) {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return;
  }

  const { signer } = await getProviderAndSigner();
  const marketContract = new ethers.Contract(
    MARKET_ADDRESS,
    MARKET_ABI,
    signer
  );

  try {
    // Fetch listing info from contract
    const listing = await marketContract.listings(tid);

    if (!listing.active) {
      alert("This token is not listed for sale.");
      return;
    }

    const priceWei: bigint = listing.price;
    console.log(
      "Buying token",
      tid,
      "for",
      ethers.formatEther(priceWei),
      "ETH"
    );

    // Correct call for your Solidity function:
    // function buyTicket(uint256 tokenId) external payable
    const tx = await marketContract.buyTicket(tid, { value: priceWei });

    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Receipt:", receipt);
  } catch (err: any) {
    console.error("buy error:", err);
    alert("Buy failed: " + (err?.message || JSON.stringify(err)));
  }
}

export async function mintTicket() {
  if (!window.ethereum) return;

  const { signer } = await getProviderAndSigner();
  const contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);

  const address = await signer.getAddress();

  try {
    const tx = await contract.mintTicket(address);
    console.log("tx hash:", tx.hash);
    await tx.wait();
  } catch (err: any) {
    console.error("mint error:", err);
    alert("Mint failed: " + (err?.message || err));
  }
}
