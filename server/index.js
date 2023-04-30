const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0307c2305a771f83e8b449b4a812a715dc51566335bb149dc7e8aed7e8dad2e9e2": 100,
  "03f3b44f87f32ba91a3662d1aa8cc9ad5965d21218cd3774193baf37cacfc74d16": 50,
  "03053d274823a67a64d502332f85b4c0a51f0374c48da82a811ecaeb3c04914cd8": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  /* 
    TODO - get a signature from the client side
    validate the public key from the signature
  */

  let { sender, recipient, amount, signature, messageHash } = req.body;

  signature = JSON.parse(signature);
  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);

  // Check signature of sender
  const verifyMsg = secp256k1.verify(signature, messageHash, sender);
  if ( !verifyMsg ) {
    console.log("Message not verified");
    res.status(400).send({ message: "Incorrect key" });
  } else {
    console.log("Message is verified");
    setInitialBalance(sender);
    setInitialBalance(recipient);
  
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
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
