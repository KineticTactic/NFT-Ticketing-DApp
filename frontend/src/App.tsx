import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  NFT_ABI,
  MARKET_ABI,
  NFT_ADDRESS,
  MARKET_ADDRESS,
} from "./contractConfig";

// Add ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [marketListings, setMarketListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  // Modal state
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [sellTokenId, setSellTokenId] = useState<number | null>(null);
  const [sellPrice, setSellPrice] = useState<string>(""); // price in ETH string
  const [listingInProgress, setListingInProgress] = useState(false);

  useEffect(() => {
    if (account) {
      fetchOwnedTokens();
      loadMarketplace();
    } else {
      setOwnedTokens([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAccount(addr);
  }

  async function getProviderAndSigner() {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  }

  async function loadMarketplace() {
    setLoadingListings(true);
    const all = await fetchAllListings();
    setMarketListings(all);
    setLoadingListings(false);
  }

  async function fetchOwnedTokens() {
    if (!account) return;
    setLoadingTokens(true);

    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);

      // tokensOfOwner fallback handling
      if (typeof nftContract.tokensOfOwner === "function") {
        // returns bigint[] in ethers v6
        const ids: bigint[] = await nftContract.tokensOfOwner(account);
        const normalized = ids.map((b: bigint) => Number(b));
        setOwnedTokens(normalized);
      } else {
        const balance: bigint = await nftContract.balanceOf(account);
        const count = Number(balance);
        const results: number[] = [];
        for (let i = 0; i < count; i++) {
          const tid: bigint = await nftContract.tokenOfOwnerByIndex(account, i);
          results.push(Number(tid));
        }
        setOwnedTokens(results);
      }
    } catch (err) {
      console.error("fetchOwnedTokens error:", err);
      setOwnedTokens([]);
    } finally {
      setLoadingTokens(false);
    }
  }

  async function mintTicket() {
    if (!window.ethereum || !account) return;

    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);

    try {
      const tx = await contract.mintTicket(account);
      console.log("tx hash:", tx.hash);
      await tx.wait();
      await fetchOwnedTokens();
      alert("Ticket minted!");
    } catch (err: any) {
      console.error("mint error:", err);
      alert("Mint failed: " + (err?.message || err));
    }
  }

  function openSellModal(tid: number) {
    setSellTokenId(tid);
    setSellPrice(""); // reset input
    setSellModalOpen(true);
  }

  function closeSellModal() {
    if (listingInProgress) return; // prevent closing mid-list
    setSellModalOpen(false);
    setSellTokenId(null);
    setSellPrice("");
  }

  async function listForSale(tid: number, priceEth: string) {
    if (!window.ethereum) return;
    if (Number.isNaN(tid) || tid <= 0) {
      alert("Enter a valid Token ID");
      return;
    }
    if (!priceEth || isNaN(Number(priceEth)) || Number(priceEth) <= 0) {
      alert("Enter a valid price in ETH");
      return;
    }

    const { signer } = await getProviderAndSigner();
    const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
    const marketContract = new ethers.Contract(
      MARKET_ADDRESS,
      MARKET_ABI,
      signer
    );

    try {
      setListingInProgress(true);

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

      // refresh owned tokens (token moved to marketplace escrow so no longer owned)
      await fetchOwnedTokens();
      alert(`Token ${tid} listed for ${priceEth} ETH`);
      closeSellModal();
      await loadMarketplace();
    } catch (err: any) {
      console.error("list error:", err);
      alert("Listing failed: " + (err?.message || JSON.stringify(err)));
    } finally {
      setListingInProgress(false);
    }
  }

  async function fetchAllListings() {
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

  async function buyTicket(tid: number) {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    if (!tid || isNaN(Number(tid))) {
      alert("Invalid token ID");
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

      alert("Purchase successful!");

      // Refresh UI
      await fetchOwnedTokens();
      await loadMarketplace();
      
    } catch (err: any) {
      console.error("buy error:", err);
      alert("Buy failed: " + (err?.message || JSON.stringify(err)));
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>NFT Ticketing DApp</h2>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <button onClick={fetchOwnedTokens} disabled={loadingTokens}>
            {loadingTokens ? "Refreshing..." : "Refresh tokens"}
          </button>
        </div>
      )}

      <hr />

      <button onClick={mintTicket} disabled={!account}>
        Mint Ticket NFT
      </button>

      <hr />

      <h3>My Tickets</h3>
      {loadingTokens ? (
        <p>Loading tokens…</p>
      ) : ownedTokens.length === 0 ? (
        <p>No tokens owned.</p>
      ) : (
        <ul>
          {ownedTokens.map((id) => (
            <li key={id} style={{ marginBottom: 8 }}>
              Token #{id}{" "}
              <button
                onClick={() => openSellModal(id)}
                style={{ marginLeft: 8 }}>
                List for sale
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Sell Modal */}
      {sellModalOpen && sellTokenId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={closeSellModal}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,
              maxWidth: "92%",
              background: "#242424",
              borderRadius: 8,
              padding: 20,
              boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            }}>
            <h3 style={{ marginTop: 0 }}>List Token #{sellTokenId} for sale</h3>

            <label style={{ display: "block", marginBottom: 8 }}>
              Price (ETH)
              <input
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="0.1"
                style={{ width: "100%", padding: "8px 10px", marginTop: 6 }}
                disabled={listingInProgress}
              />
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => {
                  if (!sellTokenId) return;
                  listForSale(sellTokenId, sellPrice);
                }}
                disabled={listingInProgress || !sellPrice}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "#0b74ff",
                  color: "white",
                  cursor: listingInProgress ? "default" : "pointer",
                }}>
                {listingInProgress ? "Listing..." : "Confirm & List"}
              </button>

              <button
                onClick={closeSellModal}
                disabled={listingInProgress}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #242424",
                  background: "#303030ff",
                  cursor: listingInProgress ? "default" : "pointer",
                }}>
                Cancel
              </button>
            </div>

            <p style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
              The marketplace will take custody of the NFT after listing. Make
              sure you are using the owner account.
            </p>
          </div>
        </div>
      )}
      <hr />

      <h3>Marketplace</h3>

      {loadingListings ? (
        <p>Loading listings...</p>
      ) : marketListings.length === 0 ? (
        <p>No tickets listed.</p>
      ) : (
        <ul>
          {marketListings.map((l) => (
            <li key={l.tokenId}>
              Ticket #{l.tokenId} — {l.price} ETH
              <br />
              Seller: {l.seller}
              <br />
              <button onClick={() => buyTicket(l.tokenId)}>
                Buy Ticket
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default App;
