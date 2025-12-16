import { useEffect, useState } from "react";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

export function useSepoliaCheck() {
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;

    const check = async () => {
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      setWrongNetwork(chainId !== SEPOLIA_CHAIN_ID);
    };

    check();

    // React to network changes
    window.ethereum.on("chainChanged", check);

    return () => {
      window.ethereum.removeListener("chainChanged", check);
    };
  }, []);

  return wrongNetwork;
}
