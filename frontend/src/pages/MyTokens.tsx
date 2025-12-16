import { useEffect, useState } from "react";
import { fetchOwnedTokens, mintTicket } from "@/lib/wallet";
import { useWallet } from "@/providers/WalletProvider";
import { TokenCard } from "@/components/Token";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSepoliaCheck } from "@/providers/SepoliaCheck";
import { Link } from "react-router-dom";

export function MyTokens() {
  const { address } = useWallet();
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const wrongNetwork = useSepoliaCheck();

  async function load() {
    if (!address) return;
    try {
      const ids = await fetchOwnedTokens(address);
      setTokenIds(ids);
    } catch (err) {
      console.error("Failed to fetch owned tokens", err);
    } finally {
      setLoading(false);
    }
  }

  async function mint() {
    setMinting(true);
    await mintTicket();
    setMinting(false);
    load();
  }

  useEffect(() => {
    if (!address) return;

    load();
  }, [address]);

  if (!address) {
    return (
      <div className="py-10">
        <p className="text-muted-foreground text-center">
          Connect your wallet to view your tickets.
        </p>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-4xl font-semibold mb-6 text-center">My Tickets</h1>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && tokenIds.length === 0 && (
        <div className="flex flex-col gap-6 items-center">
          <p className="text-muted-foreground text-center">
            You don’t own any tickets yet.
          </p>
          <Button className="mb-5" onClick={mint} disabled={minting}>
            {minting && <Spinner />}
            {minting ? "Minting..." : "Mint New Ticket"}
          </Button>
        </div>
      )}

      {!loading && tokenIds.length > 0 && (
        <div className="flex flex-col gap-6 items-center">
          <Button className="mb-5" onClick={mint} disabled={minting}>
            {minting && <Spinner />}
            {minting ? "Minting..." : "Mint New Ticket"}
          </Button>
          <div className="flex flex-row gap-6 flex-wrap justify-center px-10">
            {tokenIds.map((id) => (
              <TokenCard
                key={id}
                tokenId={id}
                seller={null}
                price={null}
                onSell={() => {
                  load();
                }}
                onBuy={null}
              />
            ))}
          </div>
        </div>
      )}

      {wrongNetwork && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center text-sm">
          Wrong network detected. Please switch your wallet to{" "}
          <strong>Sepolia</strong> and refresh. <br />
          Visit our <Link to="/faq" className="underline">FAQ page</Link> for more information.
        </div>
      )}
    </div>
  );
}
