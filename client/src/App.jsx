import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  /** Note: private key is not dynamic as this is a local hosted app.
     * to get the private key, go to the server and run node scripts/generate.js
     * after getting the private and public key pair in the console, update the private key below, and the public key in the server/index.js balances address
    */
  const PRIVATE_KEY = "b90ffa35c3a7b119c47a486f75ce7b89a15c085f65558628851b1c9f6dd51847";

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={PRIVATE_KEY}
      />
      <Transfer setBalance={setBalance} address={address} privateKey={PRIVATE_KEY} />
    </div>
  );
}

export default App;
