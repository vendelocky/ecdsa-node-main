import { useState } from "react";
import server from "./server";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // get the data format and hash it
    const data = { sender: address, recipient, amount: parseInt(sendAmount) };
    const bytes = utf8ToBytes(JSON.stringify(data));
    const messageHash = keccak256(bytes);

    // sign the hashed message with private key
    const signature = await secp256k1.sign(messageHash, privateKey);
    // split out the recovery bit to be retrieved in the server side later
    const recoveryBit = signature.recovery;
    // format the signature into uint8Array
    const signatureBytes = signature.toCompactRawBytes();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        ...data,
        signature: Array.from(signatureBytes),
        recoveryBit: recoveryBit
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
