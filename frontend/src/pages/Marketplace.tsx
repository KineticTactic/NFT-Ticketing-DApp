import { useEffect, useState } from "react";
import { fetchAllListings } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenCard } from "@/components/Token";
import { useSepoliaCheck } from "@/providers/SepoliaCheck";
import { Link } from "react-router-dom";

type Listing = {
  tokenId: number;
  seller: string;
  price: number; // ETH
};

export function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const wrongNetwork = useSepoliaCheck();

  async function load() {
    try {
      const data = await fetchAllListings();
      setListings(data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="py-10">
      <h1 className="text-4xl font-semibold mb-2 text-center">
        Ticket Marketplace
      </h1>
      <p className="text-muted-foreground text-center mb-10">
        Buy and sell tickets on-chain. No fakes. No middlemen.
      </p>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <p className="text-muted-foreground text-center">
          No tickets currently listed for sale.
        </p>
      )}

      {!loading && listings.length > 0 && (
        <div className="flex flex-row gap-6 flex-wrap justify-center px-10">
          {listings.map((listing) => (
            <TokenCard
              key={listing.tokenId}
              tokenId={listing.tokenId}
              seller={listing.seller}
              price={listing.price}
              onSell={null}
              onBuy={() => {
                load();
              }}
            />
          ))}
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
