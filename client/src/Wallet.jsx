import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey }) {

  const useMyWallet = () => {
      const myPublicKey = toHex(secp256k1.getPublicKey(privateKey));
      setAddress(myPublicKey);
      getBalance(myPublicKey);
  };
  
  const getBalance = async(add) => {
    const {
      data: { balance },
    } = await server.get(`balance/${add}`);
    setBalance(balance);
  }

  const onChange = async(evt) => {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      getBalance(address);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <button onClick={useMyWallet} className="button">Use my address</button>
      <label>
        Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      {/** This address display here is just an extra; to see the full address easier by checking the 4 start and end digit */}
      {address.length > 4 && (<div className="balance">Address: {address.slice(0,4)}....{address.slice(-4)}</div>)}
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
