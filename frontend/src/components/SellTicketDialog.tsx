import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "./ui/spinner";

type SellTicketDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenId: number;
  onConfirm: (priceEth: string) => Promise<void>;
};

export function SellTicketDialog({
  open,
  onOpenChange,
  tokenId,
  onConfirm,
}: SellTicketDialogProps) {
  const [price, setPrice] = useState("");
  const [isSelling, setIsSelling] = useState(false);

  async function handleConfirm() {
    if (!price || isSelling) return;

    try {
      setIsSelling(true);
      await onConfirm(price); // tx call
      onOpenChange(false); // close ONLY on success
      setPrice("");
    } catch (err) {
      console.error("Sell failed", err);
    } finally {
      setIsSelling(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={isSelling ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List Ticket #{tokenId}</DialogTitle>
          <DialogDescription>
            Enter the price in ETH and confirm listing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            placeholder="Price in ETH"
            value={price}
            disabled={isSelling}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isSelling}
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleConfirm} disabled={!price || isSelling}>
            {isSelling && <Spinner />}
            {isSelling ? "Listing..." : "Sell Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
