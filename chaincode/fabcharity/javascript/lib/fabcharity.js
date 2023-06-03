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
        const assets = [
            {
                id: 'a0f90386-0742-416f-990b-acf69ed0bb70',
                hash_value: '52ec320c7256d92dd0fb171f81b2fe47',
            },
            {
                id: '80fa43cc-35bf-467d-8848-78f7b55c105a',
                hash_value: 'c3f95d305aa3aa0ad037f38b71d5e452',
            },
            {
                id: 'e3c15908-2425-4f61-a7f8-f029d8f6756c',
                hash_value: '252cd64dca6b16683867e1ccac2bd6c7',
            },
            {
                id: '1846f867-3d42-4eba-9ffc-60a9884acbeb',
                hash_value: '136b17a5a3f9b0ec8a9698560c717a33',
            },
            {
                id: '4cf3fc4c-d016-4065-9556-496516eb61a4',
                hash_value: '1085517b3384f94b88f5d5fbd3e2b3d3',
            },
            {
                id: 'b2d87144-86c9-4c15-b771-7869845be99d',
                hash_value: 'a803b79f534aa8055377ffc1bd9945c7',
            },

            // a0f90386-0742-416f-990b-acf69ed0bb70
            // 52ec320c7256d92dd0fb171f81b2fe47
            // 80fa43cc-35bf-467d-8848-78f7b55c105a
            // c3f95d305aa3aa0ad037f38b71d5e452
            // e3c15908-2425-4f61-a7f8-f029d8f6756c
            // 252cd64dca6b16683867e1ccac2bd6c7
            // 1846f867-3d42-4eba-9ffc-60a9884acbeb
            // 136b17a5a3f9b0ec8a9698560c717a33
            // 4cf3fc4c-d016-4065-9556-496516eb61a4
            // 1085517b3384f94b88f5d5fbd3e2b3d3
            // b2d87144-86c9-4c15-b771-7869845be99d
            // a803b79f534aa8055377ffc1bd9945c7
        ];

        for (let i = 0; i < assets.length; i++) {
            await ctx.stub.putState(assets[i].id, Buffer.from(JSON.stringify(assets[i])));
            console.info('Added <-->', assets[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
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

}

module.exports = FabCharity;
