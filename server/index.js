const express = require("express");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// can add more public addresses here!
const balances = {
  "036c6d19bca0f6751fc3deeffcd5f96c644f706233c31f433182a2912ca48654a2": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recoveryBit } = req.body;

  // Convert the signature from a regular array back to Uint8Array
  const signatureBytes = new Uint8Array(signature);

  // re-create the signature from the signatureBytes
  const sig = secp256k1.Signature.fromCompact(signatureBytes);
  // add the recovery value from the recoveryBit
  sig.recovery = recoveryBit;

  // Hash the received data
  const data = { sender, recipient, amount };
  const hash = keccak256(Buffer.from(JSON.stringify(data)));

  // recover the public key
  const recoveredPublicKey = sig.recoverPublicKey(toHex(hash));
  const senderPublicKey = toHex(recoveredPublicKey.toRawBytes());

  // Verify that the public key is valid
  const isValidSignature = secp256k1.verify(signatureBytes, hash, senderPublicKey);

  if (isValidSignature) {
    if (senderPublicKey === sender) {
      setInitialBalance(sender);
      setInitialBalance(recipient);

      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
    } else {
      res.status(400).send({ message: "You can't transfer from this account! It's not yours!" });
    }
  } else {
    res.status(400).send({ message: "Signature invalid! Please use a proper private-public key pair!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
