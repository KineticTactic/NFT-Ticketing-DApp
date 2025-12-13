import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  NFT_ABI,
  MARKET_ABI,
  NFT_ADDRESS,
  MARKET_ADDRESS,
} from "./contractConfig";
import GenerativeSVG from "./components/GenerativeSVG";
import { Button } from "./components/ui/button";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { MyTokens } from "./pages/MyTokens";
import { Marketplace } from "./pages/Marketplace";

// Add ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-tokens" element={<MyTokens />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </div>
  );
}
export default App;
