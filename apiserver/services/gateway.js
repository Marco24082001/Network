const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const gateway = new Gateway();

async function initGateway () {
  try {
    const ccpPath = path.resolve(process.cwd(), '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);  
    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUserOrg1');
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
      // Create a new gateway for connecting to our peer node.
    await gateway.connect(ccp, { wallet, identity: 'appUserOrg1', discovery: { enabled: true, asLocalhost: true } });
  } catch (err) {
    console.log(err);
  }
}

initGateway();


module.exports = {
  gateway
}