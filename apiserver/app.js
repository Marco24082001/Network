var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
const { validateToken } = require("./middlewares/authmiddleware");
const path = require('path');
const fs = require('fs');
const { Contract } = require("./services/contract");
const ContractService = new Contract();
ContractService.init();

app.get('/api/queryallassets', validateToken, async function (req, res) {
    try {
        const result = await ContractService.query_transaction(req.user.role, "queryAllAssets");
        console.log(JSON.parse(result)[0]["Record"]);   
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({ response: result.toString() });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
    }
});

app.get('/api/query/:id', validateToken, async function (req, res) {
    try {
        const result = await ContractService.query_transaction(req.user.role, "queryAsset", req.params.id);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({ response: result.toString() });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
    }
});

app.post('/api/addasset/', validateToken, async function (req, res) {
    try {
        await ContractService.logic_transaction(req.user.role, "createAsset", req.body.id, req.body.hash);
        res.status(200).json({ response: 'Transaction has been submitted' });
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
})

app.put('/api/changeAsset/:id', async function (req, res) {
    try {
        await ContractService.logic_transaction(req.user.role, "changeAssetHash", req.params.id, req.body.hash);
        console.log('Transaction has been submitted');
        res.status(200).json({ response: 'Transaction has been submitted' });
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
})

app.delete("/api/deleteAsset/:id", async function (req, res) {
    try {
        await ContractService.logic_transaction(req.user.role, "deleteAssetHash", req.params.id);
        console.log('Transaction has been submitted');
        res.status(200).json({ response: 'Transaction has been submitted' });
    } catch (error) {
        console.log(`Failed to submit transaction: ${error}`)
    }
})

app.listen(8000);
