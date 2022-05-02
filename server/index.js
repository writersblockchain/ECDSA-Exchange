const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require('@noble/secp256k1');
const sha256 = require('crypto-js/sha256');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());


let privateKey1 = secp.utils.randomPrivateKey(); 
privateKey1 = Buffer.from(privateKey1).toString('hex');
// console.log('privateKey1:',privateKey1);


let publicKey1 = secp.getPublicKey(privateKey1)
publicKey1 = Buffer.from(publicKey1).toString('hex');
publicKey1 = '0x' + publicKey1.slice(publicKey1.length - 40); 
// console.log('publicKey1:',publicKey1);

// console.log('*************');

let privateKey2 = secp.utils.randomPrivateKey(); 
privateKey2 = Buffer.from(privateKey2).toString('hex');
// console.log('privateKey2:',privateKey2);


let publicKey2 = secp.getPublicKey(privateKey2)
publicKey2 = Buffer.from(publicKey2).toString('hex');
publicKey2 = '0x' + publicKey2.slice(publicKey2.length - 40); 
// console.log('publicKey2:',publicKey2);

// console.log('*************');

let privateKey3 = secp.utils.randomPrivateKey(); 
privateKey3 = Buffer.from(privateKey3).toString('hex');
// console.log('privateKey3:',privateKey3);

let publicKey3 = secp.getPublicKey(privateKey3)
publicKey3 = Buffer.from(publicKey3).toString('hex');
publicKey3 = '0x' + publicKey3.slice(publicKey3.length - 40); 
// console.log('publicKey3:',publicKey3);

// console.log('*************');


// (async () => {
//   // keys, messages & other inputs can be Uint8Arrays or hex strings
//   // Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) === 'deadbeef'
//   const privateKey = secp.utils.randomPrivateKey();
//   const messageHash = await secp.utils.sha256("hello world");
//   const publicKey = secp.getPublicKey(privateKey);
//   const signature = await secp.sign(messageHash, privateKey);
//   const isValid = secp.verify(signature, messageHash, publicKey);

// })();

// (async () => {

// let myMessageHash = await secp.utils.sha256("test");
// let mySignature = await secp.sign(myMessageHash, privateKey1);
// let recoveredPublicKey = (myMessageHash, mySignature, 1); 
// console.log('recoveredPublicKey:', recoveredPublicKey);
// console.log(recoveredPublicKey);

// })();




const balances = {
  [publicKey1]: 100,
  [publicKey2]: 50,
  [publicKey3]: 75,
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, privateKey} = req.body;

  const messageHash = sha256(JSON.stringify({sender, recipient, amount})).toString();

  let recoveredPublicKey = secp.recoverPublicKey(messageHash, privateKey, 1); 

// console.log(recoveredPublicKey);

if(balances[recoveredPublicKey]) {
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
  } else console.log("try again!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(`

Available Accounts
******************
(0) ${publicKey1}
(1) ${publicKey2}
(2) ${publicKey3}

Private Keys
******************
(0) ${privateKey1}
(1) ${privateKey2}
(2) ${privateKey3}

  `);
});
