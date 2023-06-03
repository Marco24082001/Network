/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPathOrg1 = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccpOrg1 = JSON.parse(fs.readFileSync(ccpPathOrg1, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfoOrg1 = ccpOrg1.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACertsOrg1 = caInfoOrg1.tlsCACerts.pem;
        const caOrg1 = new FabricCAServices(caInfoOrg1.url, { trustedRoots: caTLSCACertsOrg1, verify: false }, caInfoOrg1.caName);

        // Create a new file system based wallet for managing identities.
        const walletPathOrg1 = path.join(process.cwd(), 'wallet');
        const walletOrg1 = await Wallets.newFileSystemWallet(walletPathOrg1);
        console.log(`Wallet path: ${walletPathOrg1}`);

        // Check to see if we've already enrolled the admin user.
        const identityOrg1 = await walletOrg1.get('adminOrg1');
        if (identityOrg1) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollmentOrg1 = await caOrg1.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509IdentityOrg1 = {
            credentials: {
                certificate: enrollmentOrg1.certificate,
                privateKey: enrollmentOrg1.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await walletOrg1.put('adminOrg1', x509IdentityOrg1);
        console.log('Successfully enrolled admin user "adminOrg1" and imported it into the wallet');

        
        // org2
        // load the network configuration
        const ccpPathOrg2 = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccpOrg2 = JSON.parse(fs.readFileSync(ccpPathOrg2, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfoOrg2 = ccpOrg2.certificateAuthorities['ca.org2.example.com'];
        const caTLSCACertsOrg2 = caInfoOrg2.tlsCACerts.pem;
        const caOrg2 = new FabricCAServices(caInfoOrg2.url, { trustedRoots: caTLSCACertsOrg2, verify: false }, caInfoOrg2.caName);

        // Create a new file system based wallet for managing identities.
        const walletPathOrg2 = path.join(process.cwd(), 'wallet');
        const walletOrg2 = await Wallets.newFileSystemWallet(walletPathOrg2);
        console.log(`Wallet path: ${walletPathOrg2}`);

        // Check to see if we've already enrolled the admin user.
        const identityOrg2 = await walletOrg2.get('adminOrg2');
        if (identityOrg2) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollmentOrg2 = await caOrg2.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509IdentityOrg2 = {
            credentials: {
                certificate: enrollmentOrg2.certificate,
                privateKey: enrollmentOrg2.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        await walletOrg2.put('adminOrg2', x509IdentityOrg2);
        console.log('Successfully enrolled admin user "adminOrg2" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "adminOrg1 and adminOrg2": ${error}`);
        process.exit(1);
    }
}

main();