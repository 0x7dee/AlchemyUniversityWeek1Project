const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";

const privateKey = secp256k1.utils.randomPrivateKey();
console.log(`Private key: ${ toHex(privateKey) }`);

const publicKey = secp256k1.getPublicKey(privateKey);
console.log(`Public key: ${ toHex(publicKey) }`);

const address = keccak256(publicKey.slice(publicKey.length - 20));
console.log(`Address is: ${ toHex(address) }`)

const signature = secp256k1.sign(messageHash, privateKey);
console.log(signature);

const verified = secp256k1.verify(signature, messageHash, publicKey);
console.log(verified);

//const signedMessage = secp256k1.sign(messageHash, privateKey);
//console.log(`Signed message: ${ toHex(signedMessage) }`)