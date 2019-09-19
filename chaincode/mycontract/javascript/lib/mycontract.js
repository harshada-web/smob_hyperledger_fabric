/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MyContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const txns = [
           
            {
				id: '0',
                material: 'Rubber',
                quantity: '500',
                sender: 'DX',
                receiver: 'Ramu Kaka',
				date: '20/20/1010',
				price: '1000',
            },
        ];

        for (let i = 0; i < txns.length; i++) {
            txns[i].docType = 'txn';
            await ctx.stub.putState('TXNS' + i, Buffer.from(JSON.stringify(txns[i])));
            console.info('Added <--> ', txns[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async create(ctx, txnID, data) {
        console.info('============= START : Create Car ===========');
       await ctx.stub.putState(txnID, Buffer.from(data));
        console.info('============= END : Create Car ===========');
    }
	
	async myfunc(ctx){
	console.info("@@@@@@@@@@@@@@@@@@@@@@@@@@2inside my function P:)");
	const bc = {name:'shubh'};	
	return JSON.stringify(bc);
	}
	
    async getAllTransactions(ctx) {
        const startKey = 'TXNS0';
        const endKey = 'TXNS999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }


}
module.exports = MyContract;
