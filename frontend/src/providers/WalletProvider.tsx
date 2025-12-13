import { ethers } from "ethers";
import { createContext, useContext, useState } from "react";

type WalletContextType = {
  address: string | null;
  connectWallet: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}


export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const addr = await signer.getAddress();

    setAccount(addr);
  }

  return (
    <WalletContext.Provider value={{ address: account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
