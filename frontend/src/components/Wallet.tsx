import { useWallet } from "@/providers/WalletProvider";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";


export function Wallet() {
  const { address, connectWallet } = useWallet();

  return (
    <div>
        { address ? (
        <Badge variant="secondary" className="p-2 max-w-[25ch] border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]" >
          <span className="truncate">
         <span className="text-purple-400">●</span>  Connected {address}
          </span>
        </Badge>
        ) : (
        <Button variant="default" className="p-2 px-5" onClick={connectWallet}>  
          Connect Wallet
        </Button>
        )}  
</div>
  );
}