import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {

  
    let privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = toHex(secp.secp256k1.getPublicKey(privateKey));
    setAddress(address);
    
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Enter your private key" value={privateKey} onChange={onChange}></input>
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
