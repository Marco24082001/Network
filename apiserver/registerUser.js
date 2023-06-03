/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Org1
        // load the network configuration
        const ccpPathOrg1 = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccpOrg1 = JSON.parse(fs.readFileSync(ccpPathOrg1, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURLOrg1 = ccpOrg1.certificateAuthorities['ca.org1.example.com'].url;
        const caOrg1 = new FabricCAServices(caURLOrg1);

        // Create a new file system based wallet for managing identities.
        const walletPathOrg1 = path.join(process.cwd(), 'wallet');
        const walletOrg1 = await Wallets.newFileSystemWallet(walletPathOrg1);
        console.log(`Wallet path: ${walletPathOrg1}`);

        // Check to see if we've already enrolled the user.
        const userIdentityOrg1 = await walletOrg1.get('appUserOrg1');
        if (userIdentityOrg1) {
            console.log('An identity for the user "appUser" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentityOrg1 = await walletOrg1.get('adminOrg1');
        if (!adminIdentityOrg1) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const providerOrg1 = walletOrg1.getProviderRegistry().getProvider(adminIdentityOrg1.type);
        const adminUserOrg1 = await providerOrg1.getUserContext(adminIdentityOrg1, 'admin');
        // Register the user, enroll the user, and import the new identity into the wallet.
        const secretOrg1 = await caOrg1.register({
            affiliation: 'org1.department1',
            enrollmentID: 'appUserOrg1',
            role: 'client'
        }, adminUserOrg1);
        
        const enrollmentOrg1 = await caOrg1.enroll({
            enrollmentID: 'appUserOrg1',
            enrollmentSecret: secretOrg1
        });
        
        const x509IdentityOrg1 = {
            credentials: {
                certificate: enrollmentOrg1.certificate,
                privateKey: enrollmentOrg1.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await walletOrg1.put('appUserOrg1', x509IdentityOrg1);
        console.log('Successfully registered and enrolled admin user "appUserOrg1" and imported it into the wallet');


        // Org2
        // load the network configuration
        const ccpPathOrg2 = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccpOrg2 = JSON.parse(fs.readFileSync(ccpPathOrg2, 'utf8'));
        // Create a new CA client for interacting with the CA.
        const caURLOrg2 = ccpOrg2.certificateAuthorities['ca.org2.example.com'].url;
        const caOrg2 = new FabricCAServices(caURLOrg2);
        
        // Create a new file system based wallet for managing identities.
        const walletPathOrg2 = path.join(process.cwd(), 'wallet');
        const walletOrg2 = await Wallets.newFileSystemWallet(walletPathOrg2);
        console.log(`Wallet path: ${walletPathOrg2}`);
        
        // Check to see if we've already enrolled the user.
        const userIdentityOrg2 = await walletOrg2.get('appUserOrg2');
        if (userIdentityOrg2) {
            console.log('An identity for the user "appUser" already exists in the wallet');
            return;
        }
        
        // Check to see if we've already enrolled the admin user.
        const adminIdentityOrg2 = await walletOrg2.get('adminOrg2');
        if (!adminIdentityOrg2) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }
        
        // build a user object for authenticating with the CA
        const providerOrg2 = walletOrg2.getProviderRegistry().getProvider(adminIdentityOrg2.type);
        const adminUserOrg2 = await providerOrg2.getUserContext(adminIdentityOrg2, 'admin');
        
        // Register the user, enroll the user, and import the new identity into the wallet.
        const secretOrg2 = await caOrg2.register({
            affiliation: 'org2.department1',
            enrollmentID: 'appUserOrg2',
            role: 'client'
        }, adminUserOrg2);

        const enrollmentOrg2 = await caOrg2.enroll({
            enrollmentID: 'appUserOrg2',
            enrollmentSecret: secretOrg2
        });
        const x509IdentityOrg2 = {
            credentials: {
                certificate: enrollmentOrg2.certificate,
                privateKey: enrollmentOrg2.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        await walletOrg2.put('appUserOrg2', x509IdentityOrg2);
        console.log('Successfully registered and enrolled admin user "appUserOrg2" and imported it into the wallet');

    } catch (error) {
        process.exit(1);
    }
}

main();