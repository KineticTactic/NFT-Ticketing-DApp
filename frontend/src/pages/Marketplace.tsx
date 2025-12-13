import { useEffect, useState } from "react";
import { fetchAllListings } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenCard } from "@/components/Token";

type Listing = {
  tokenId: number;
  seller: string;
  price: number; // ETH
};

export function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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
        <p className="text-muted-foreground">
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
    </div>
  );
}
