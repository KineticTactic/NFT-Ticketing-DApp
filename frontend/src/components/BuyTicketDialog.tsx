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
import { Spinner } from "./ui/spinner";

type BuyTicketDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenId: number;
  onConfirm: () => Promise<void>;
  price: number;
  seller: string;
};

export function BuyTicketDialog({
  open,
  onOpenChange,
  tokenId,
  onConfirm,
  price,
  seller,
}: BuyTicketDialogProps) {
  const [isBuying, setIsBuying] = useState(false);

  async function handleConfirm() {
    if (isBuying) return;

    try {
      setIsBuying(true);
      await onConfirm(); // send tx
      onOpenChange(false); // close only on success
    } catch (err) {
      console.error("Buy failed", err);
    } finally {
      setIsBuying(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={isBuying ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Ticket #{tokenId}</DialogTitle>
          <DialogDescription>
            <div className="space-y-1">
              <p>
                <span className="text-muted-foreground">Seller:</span> {seller}
              </p>
              <p>
                <span className="text-muted-foreground">Price:</span>{" "}
                <span className="font-medium">{price}</span> ETH
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isBuying}
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleConfirm} disabled={isBuying}>
            {isBuying && <Spinner />}
            {isBuying ? "Buying..." : "Buy Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
