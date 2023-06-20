/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCharity extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
    }

    async queryAsset(ctx, id) {
        const assetAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(assetAsBytes.toString());
        return assetAsBytes.toString();
    }

    async createAsset(ctx, id, hash_value) {
        console.info('============= START : Create Car ===========');

        const asset = {
            docType: 'asset',
            hash_value,
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllassets(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeAssetHash(ctx, id, new_hash_value) {
        console.info('============= START : changeCarOwner ===========');

        const assetAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const asset = JSON.parse(assetAsBytes.toString());
        asset.hash_value = new_hash_value;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : changeCarOwner ===========');
    }

    async deleteAssetHash(ctx, id) {
        const exists = await this.assetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async assetExists(ctx, id) {
        const assetAsBytes = await ctx.stub.getState(id);
        return assetAsBytes && assetAsBytes.length > 0;
    }
}

module.exports = FabCharity;
