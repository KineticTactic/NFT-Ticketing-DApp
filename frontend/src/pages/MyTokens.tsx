import { useEffect, useState } from "react";
import { fetchOwnedTokens, mintTicket } from "@/lib/wallet";
import { useWallet } from "@/providers/WalletProvider";
import { TokenCard } from "@/components/Token";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function MyTokens() {
  const { address } = useWallet();
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);

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
    </div>
  );
}
