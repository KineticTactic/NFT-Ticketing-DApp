import { Navbar } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { MyTokens } from "./pages/MyTokens";
import { Marketplace } from "./pages/Marketplace";
import Faq from "./pages/Faq";

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
        <Route path="/faq" element={<Faq />} /> 
      </Routes>
    </div>
  );
}
export default App;
