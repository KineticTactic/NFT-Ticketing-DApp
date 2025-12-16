import { Button } from "@/components/ui/button";
import { useWallet } from "@/providers/WalletProvider";
import { Link, useNavigate } from "react-router-dom";

export function Hero() {
  const { address, connectWallet } = useWallet();
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-4 min-h-[90vh]">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
        NFT Ticketing DApp
      </h1>

      {/* Tagline */}
      <p className="mt-4 max-w-xl text-muted-foreground text-base md:text-lg">
        Mint, trade, and verify event tickets on-chain. No fakes. No middlemen.
      </p>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        {!address ? (
          <Button size="lg" onClick={connectWallet}>
            Connect Wallet
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              variant="default"
              onClick={() => navigate("/my-tokens")}>
              My Tokens
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/marketplace")}>
              Marketplace
            </Button>
          </>
        )}
      </div>

      <div className="mt-8">
        <p className="text-muted-foreground text-sm">
          Having trouble accessing the app? Check out the{" "}
          <Link to="/faq"className="text-secondary-foreground">
            FAQ page.
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
