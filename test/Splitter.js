const Splitter = artifacts.require("./Splitter.sol");
const BigNumber = require('bignumber.js');
const Promise = require("bluebird");
Promise.promisifyAll(web3.eth, { suffix: "Promise" });


contract('Splitter', function(accounts) {
	
	const account_Alice = accounts[0];
	const account_Bob = accounts[1];
	const account_Carol = accounts[2];
	const account_Eve = accounts[3];

	let instance;
	beforeEach("should create a Splitter contract", function() {
		return Splitter.new({ from: account_Alice, gas:5000000 })
			.then(_instance => instance = _instance)
	})

	it ("should store administrator's account (Alice)", function(){
		return instance.getOwner()
			.then(account => {
				assert.equal(account,account_Alice,"administrator account not stored correctly")
			})
	})

	it ("should allow to get the Stop Switch", function() {
		return instance.getStopSwitch()
			.then ( status =>  {
				assert.isFalse(status,"Unable to get Stop Switch");
			})
	})
		
	it ("should allow administrator set the Stop Switch", function() {
			return instance.setStopSwitch(true,{from:account_Alice})
			.then ( txObj => { 
				assert.equal(txObj.receipt.status,1, "setStopSwitch failed");
				assert.equal(txObj.logs.length,1, "setStopSwitch emitted an incorrect number of events");
			    assert.equal(txObj.logs[0].event,"LogStopSwitchSet", "wrong event emitted at setSwopSwitch");		
				assert.equal(txObj.logs[0].args.authorizer,account_Alice, "should be Alice account");
				assert.equal(txObj.logs[0].args.statusSwitch,true, "should be true");
				return instance.getStopSwitch({from:account_Alice})
			})
			then ( status => {
				assert.isTrue(status,"Stop Switch was not set correctly")
			})
	})

	it ("Bob should be able to split ether", function() {
		   	let balance_Carol_before, balance_Eve_before, balance_Carol_after_str, balance_Eve_after_str, split_amountv, split_amount_str;
			return instance.balances(account_Carol)
			.then(balance =>  {
			      balance_Carol_before = new BigNumber (balance);
	       		  return instance.balances(account_Eve)
			})
			.then (balance => {
			      balance_Eve_before = new BigNumber(balance);
			      return instance.split(account_Carol,account_Eve,{from:account_Bob,value:web3.toWei(0.4,"ether")})
			}) 
			.then ( txObj => { 
			      assert.equal(txObj.receipt.status,1, "split failed");
				  assert.equal(txObj.logs.length,1, "split emitted an incorrect number of events");	
				  assert.equal(txObj.logs[0].event,"LogSplit", "wrong event emitted at split");
				  assert.equal(txObj.logs[0].args.from,   account_Bob, "should be Bob's account");
				  assert.equal(txObj.logs[0].args.receiver1, account_Carol, "should be Carol's account");  
				  split_amount = new BigNumber (web3.toWei(0.2,"ether"));
				  split_amount_str = split_amount.toString(10);
				  let amount1 = txObj.logs[0].args.amount1 ;
				  let amount1_str = amount1.toString(10);   
				  assert.strictEqual(split_amount_str,amount1_str,"Split event did not record the right amount1");
				  assert.equal(txObj.logs[0].args.receiver2, account_Eve, "should be Eve's account");
				  let amount2 = txObj.logs[0].args.amount2 ;
				  let amount2_str = amount2.toString(10);   
				  assert.strictEqual(split_amount_str,amount2_str,"Split event did not record the right amount2");
				  return instance.balances(account_Carol)
			})
			.then ( balance => {
				balance_Carol_after_str = balance.toString(10);
				let aux = new BigNumber (balance_Carol_before.plus(split_amount));
				let aux_str = aux.toString(10);
				assert.strictEqual(balance_Carol_after_str, aux_str,"Split Transaction did not work for Carol"); 
				return instance.balances(account_Eve)			  	
			})
			.then (balance => {
				balance_Eve_after_str = balance.toString(10);
				let aux = new BigNumber (balance_Eve_before.plus(split_amount));
				let aux_str = aux.toString(10);
				assert.strictEqual(balance_Eve_after_str, aux_str,"Split Transaction did not work for Eve"); 
			})
	})
		
	it ("Carol should be able to withdraw funds", function(){
		
		let account_balance_before, account_balance_after, balance_Carol_before, balance_Carol_before_str,
			tx, grasPrice, fee, txOjb, balance_Carol_after;
		return instance.split(account_Carol,account_Eve,{from:account_Bob,value:web3.toWei(0.4,"ether")})
		    .then ( () => web3.eth.getBalancePromise(account_Carol))
			.then ( account_balance => {
				account_balance_before = account_balance;
				return instance.balances(account_Carol)
			})
			.then ( balance => {
				balance_Carol_before = balance;
				balance_Carol_before_str = balance_Carol_before.toString(10);
				return instance.withdraw({from:account_Carol})
			})
			.then ( _txObj => { 
				txObj = _txObj;
				assert.equal(txObj.receipt.status,1, "withdrawal failed");
				assert.equal(txObj.logs.length,1, "withdrawal emitted an incorrect number of events");
				assert.equal(txObj.logs[0].event,"LogWithdraw", "wrong event emitted at withdrawal");
				assert.equal(txObj.logs[0].args.receiver, account_Carol, "should be Carol's account");
				let aux_str = txObj.logs[0].args.amount.toString(10);
				assert.strictEqual(balance_Carol_before_str,aux_str,"wrong amount populated in event withdraw");
				return web3.eth.getTransactionPromise(txObj.tx);
			})
			.then ( tx => {
				gasPrice = new BigNumber (tx.gasPrice);
				fee = new BigNumber (txObj.receipt.gasUsed * gasPrice);
				return web3.eth.getBalancePromise(account_Carol);
			})
			.then ( account_balance => {
				account_balance_after = account_balance;
				let aux1 = account_balance_after.plus(fee);
				let aux2 = account_balance_before.plus(balance_Carol_before);
				let aux1_str = aux1.toString(10);
				let aux2_str = aux2.toString(10);
				assert.strictEqual(aux1_str,aux2_str,"Carol unable to withdraw funds")
				return instance.balances(account_Carol)
			})
			.then (balance => {
				balance_Carol_after = balance;
				assert.equal(balance_Carol_after,0,"balance Carol should be zero after withdrawal")
			})
	})







})
			
