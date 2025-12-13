import { Card, CardContent } from "@/components/ui/card";
import GenerativeSVG from "@/components/GenerativeSVG";
import { Button } from "./ui/button";
import { SellTicketDialog } from "./SellTicketDialog";
import { useState } from "react";
import { BuyTicketDialog } from "./BuyTicketDialog";
import { buyTicket, listForSale } from "@/lib/wallet";

type TokenCardProps = {
  tokenId: number;
  seller: string | null;
  price: number | null;
  onSell: (() => void) | null;
  onBuy: (() => void) | null;
};

export function TokenCard({
  tokenId,
  seller,
  price,
  onSell,
  onBuy,
}: TokenCardProps) {
  const [open, setOpen] = useState(false);

  async function handleSell(priceEth: string) {
    console.log(`Listing token ${tokenId} for ${priceEth} ETH`);
    await listForSale(tokenId, priceEth);
    setOpen(false);
    onSell!();
  }

  async function handleBuy() {
    console.log(seller);
    await buyTicket(tokenId);
    console.log("BOUGHT");
    setOpen(false);
    onBuy!();
  }

  return (
    <>
      <Card className=" overflow-hidden max-w-[10rem] p-2 gap-1">
        <div className="aspect-square bg-muted w-full rounded-md overflow-hidden">
          <GenerativeSVG seed={`token-${tokenId}`} />
        </div>

        <CardContent className="p-0 pt-2">
          <div className="text-m text-center font-medium">
            Ticket #{tokenId}
          </div>

          {seller ? (
            <>
              <div className="text-sm text-muted-foreground text-center">
                {price} ETH
              </div>
              <Button className="w-full mt-3" onClick={() => setOpen(true)}>
                Buy Ticket
              </Button>
            </>
          ) : (
            <Button className="w-full mt-3" onClick={() => setOpen(true)}>
              Sell Ticket
            </Button>
          )}
        </CardContent>
      </Card>

      {seller && price ? (
        <BuyTicketDialog
          open={open}
          onOpenChange={setOpen}
          tokenId={tokenId}
          onConfirm={handleBuy}
          seller={seller}
          price={price}
        />
      ) : (
        <SellTicketDialog
          open={open}
          onOpenChange={setOpen}
          tokenId={tokenId}
          onConfirm={handleSell}
        />
      )}
    </>
  );
}
