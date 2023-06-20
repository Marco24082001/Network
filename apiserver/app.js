var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

app.get('/api/queryallassets', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUserOrg1');
        if (!identity) {
            console.log('An identity for the user "appUserOrg1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUserOrg1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('fabcharitychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcharity');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllassets');
        console.log(JSON.parse(result)[0]["Record"]);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({ response: result.toString() });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        process.exit(1);
    }
});

app.get('/api/query/:id', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUserOrg1');
        if (!identity) {
            console.log('An identity for the user "appUserOrg1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUserOrg1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('fabcharitychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcharity');
        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAsset', req.params.id);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({ response: result.toString() });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        process.exit(1);
    }
});

app.post('/api/addasset/', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUserOrg1');
        if (!identity) {
            console.log('An identity for the user "appUserOrg1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUserOrg1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('fabcharitychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcharity');
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        console.log('thanhbi')
        console.log(req.body)
        await contract.submitTransaction('createAsset', req.body.id, req.body.hash);
        // res.status(200).json({response: "Transac/tion has been submitted"})
        res.status(200).json({ response: 'thanhvi' });

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
})

app.put('/api/changeAsset/:id', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUserOrg1');
        if (!identity) {
            console.log('An identity for the user "appUserOrg1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUserOrg1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('fabcharitychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcharity');
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('changeAssetHash', req.params.id, req.body.hash);
        console.log('Transaction has been submitted');
        res.status(200).json({ response: 'Transaction has been submitted' });

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
})

app.delete("/api/deleteAsset/:id", async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUserOrg1');
        if (!identity) {
            console.log('An identity for the user "appUserOrg1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUserOrg1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('fabcharitychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcharity');
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('deleteAssetHash', req.params.id);
        console.log('Transaction has been submitted');
        console.log('delete inprogress')
        res.status(200).json({ response: 'Transaction has been submitted' });
        console.log('delete successful  ')
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.log(`Failed to submit transaction: ${error}`)
    }
})

app.listen(8000);
