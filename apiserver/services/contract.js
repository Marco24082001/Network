const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

class Contract {
    async init() {
        try {
            // ADMINISTRATOR
            const ccpPathOrg1 = path.resolve(process.cwd(), '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccpOrg1 = JSON.parse(fs.readFileSync(ccpPathOrg1, 'utf8'));
            // Create a new file system based wallet for managing identities.
            const walletPathOrg1 = path.join(process.cwd(), 'wallet/administrator');
            const walletOrg1 = await Wallets.newFileSystemWallet(walletPathOrg1);
            // Check to see if we've already enrolled the user.
            const identityOrg1 = await walletOrg1.get('appUserOrg1');
            if (!identityOrg1) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying1');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gatewayOrg1 = new Gateway();
            await gatewayOrg1.connect(ccpOrg1, { wallet: walletOrg1, identity: 'appUserOrg1', discovery: { enabled: true, asLocalhost: true } });
            // Get the network (channel) our contract is deployed to.
            const networkOrg1 = await gatewayOrg1.getNetwork('fabcharitychannel');
            // Get the contract from the network.
            this.contractOrg1 = networkOrg1.getContract('fabcharity');

            // FUNDRAISER
            const ccpPathOrg2 = path.resolve(process.cwd(), '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
            const ccpOrg2 = JSON.parse(fs.readFileSync(ccpPathOrg2, 'utf8'));
            // Create a new file system based wallet for managing identities.
            const walletPathOrg2 = path.join(process.cwd(), 'wallet/fundraiser');
            const walletOrg2 = await Wallets.newFileSystemWallet(walletPathOrg2);
            // Check to see if we've already enrolled the user.
            const identityOrg2 = await walletOrg2.get('appUserOrg2');
            if (!identityOrg2) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying2');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gatewayOrg2 = new Gateway();
            await gatewayOrg2.connect(ccpOrg2, { wallet: walletOrg2, identity: 'appUserOrg2', discovery: { enabled: true, asLocalhost: true } });
            // Get the network (channel) our contract is deployed to.
            const networkOrg2 = await gatewayOrg2.getNetwork('fabcharitychannel');
            // Get the contract from the network.
            this.contractOrg2 = networkOrg2.getContract('fabcharity');

            // SUPPORTER
            const ccpPathOrg3 = path.resolve(process.cwd(), '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
            const ccpOrg3 = JSON.parse(fs.readFileSync(ccpPathOrg3, 'utf8'));
            // Create a new file system based wallet for managing identities.
            const walletPathOrg3 = path.join(process.cwd(), 'wallet/supporter');
            const walletOrg3 = await Wallets.newFileSystemWallet(walletPathOrg3);
            // Check to see if we've already enrolled the user.
            const identityOrg3 = await walletOrg3.get('appUserOrg3');
            if (!identityOrg3) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying3');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gatewayOrg3 = new Gateway();
            await gatewayOrg3.connect(ccpOrg3, { wallet: walletOrg3, identity: 'appUserOrg3', discovery: { enabled: true, asLocalhost: true } });
            // Get the network (channel) our contract is deployed to.
            const networkOrg3 = await gatewayOrg3.getNetwork('fabcharitychannel');
            // Get the contract from the network.
            this.contractOrg3 = networkOrg3.getContract('fabcharity');
        } catch (err) {
            console.log(err);
        }
    }

    async query_transaction(role, invoke_name, ...args) {
        if (role === 'ADMIN') {
            return await this.contractOrg1.evaluateTransaction(invoke_name, ...args);
        } else if (role === 'USER') {
            return await this.contractOrg2.evaluateTransaction(invoke_name, ...args);
        } else if (role === 'GUEST') {
            return await this.contractOrg3.evaluateTransaction(invoke_name, ...args);
        }
    }

    async logic_transaction(role, invoke_name, ...args) {
        if (role === 'ADMIN') {
            return await this.contractOrg1.submitTransaction(invoke_name, ...args);
        } else if (role === 'USER') {
            return await this.contractOrg2.submitTransaction(invoke_name, ...args);
        } else if (role === 'GUEST') {
            return await this.contractOrg3.submitTransaction(invoke_name, ...args);
        }
    }
}

// const ContractService = new Contract();
module.exports = {
    Contract: Contract
}
