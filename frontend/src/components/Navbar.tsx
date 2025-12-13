import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Wallet } from "./Wallet";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background px-4 py-2">
      <div className=" flex h-14 items-center justify-between w-full">
        {/* <div className="flex items-center gap-4 justify-between"> */}
          <Link to="/" className="font-semibold text-2xl hover:opacity-80">
            <span className="font-semibold text-2xl">NFT Ticketing DApp</span>
          </Link>
          <nav className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/marketplace")}>
              Marketplace
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/my-tokens")}>
              My Tickets
            </Button>
          </nav>

        <Wallet />
      </div>
    </header>
  );
}
