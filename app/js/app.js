const Web3 = require("web3");
const Promise = require("bluebird");
const truffleContract = require("truffle-contract");
const $ = require("jquery");
const splitterJson = require("../../build/contracts/Splitter.json");
require("file-loader?name=../index.html!../index.html");
require("file-loader?name=../stylesheets.s!../index.html");

if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
} else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); 
}

Promise.promisifyAll(web3.eth, { suffix: "Promise" });
Promise.promisifyAll(web3.version, { suffix: "Promise" });

const Splitter = truffleContract(splitterJson);
Splitter.setProvider(web3.currentProvider);

window.addEventListener('load', function() {
    let deployed;
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            if (accounts.length == 0) {
                $("#balance").html("N/A");
                throw new Error("No account with which to transact");
            }
            window.account0 = accounts[0];
            window.account1 = accounts[1];
            window.account2 = accounts[2];
            window.account3 = accounts[3];
            window.account4 = accounts[4];
            return web3.version.getNetworkPromise();
        })
        .then(network => {
            return web3.eth.getBalancePromise(window.account0);
        })
        .then(balance => {
            ethBalance = web3.fromWei(balance,"ether");
        	$("#balance0").html(ethBalance.toString(10));
            return Splitter.deployed();
        })
        .then(_deployed => {
        	deployed = _deployed;
        	return deployed.balances.call(window.account0);
        })
        .then(balance => {
        	ethBalance = web3.fromWei(balance,"ether");
        	$("#splitterBalance0").html(ethBalance.toString(10));
        	return web3.eth.getBalancePromise(window.account1);
        })
        .then(balance => {
            ethBalance = web3.fromWei(balance,"ether");
        	$("#balance1").html(ethBalance.toString(10));
            return deployed.balances.call(window.account1);
        })
        .then(balance => {
        	ethBalance = web3.fromWei(balance,"ether");
        	$("#splitterBalance1").html(ethBalance.toString(10));
            return web3.eth.getBalancePromise(window.account2);
        })
        .then(balance => {
            ethBalance = web3.fromWei(balance,"ether");
        	$("#balance2").html(ethBalance.toString(10));
            return deployed.balances.call(window.account2);
        })
        .then(balance => {
        	ethBalance = web3.fromWei(balance,"ether");
        	$("#splitterBalance2").html(ethBalance.toString(10));
            return web3.eth.getBalancePromise(window.account3);
        })
        .then(balance => {
            ethBalance = web3.fromWei(balance,"ether");
        	$("#balance3").html(ethBalance.toString(10));
            return deployed.balances.call(window.account3);
        })
        .then(balance => {
        	ethBalance = web3.fromWei(balance,"ether");
        	$("#splitterBalance3").html(ethBalance.toString(10));
            return web3.eth.getBalancePromise(window.account4);
        })
        .then(balance => {
            ethBalance = web3.fromWei(balance,"ether");
        	$("#balance4").html(ethBalance.toString(10));
            return deployed.balances.call(window.account4);
        })
        .then(balance => {
        	ethBalance = web3.fromWei(balance,"ether");
            return $("#splitterBalance4").html(ethBalance.toString(10));
        })
        .then(() => $("#split0").click({buttonNumber: 0 }, split))
        .then(() => $("#split1").click({buttonNumber: 1 }, split))
        .then(() => $("#split2").click({buttonNumber: 2 }, split))
        .then(() => $("#split3").click({buttonNumber: 3 }, split))
        .then(() => $("#split4").click({buttonNumber: 4 }, split))
        .then(() => $("#withdraw0").click({buttonNumber: 0 }, withdraw))
        .then(() => $("#withdraw1").click({buttonNumber: 1 }, withdraw))
        .then(() => $("#withdraw2").click({buttonNumber: 2 }, withdraw))
        .then(() => $("#withdraw3").click({buttonNumber: 3 }, withdraw))
        .then(() => $("#withdraw4").click({buttonNumber: 4 }, withdraw))
        .catch(console.error);        
});

const retreiveAccount = function (boxOption) {
    let account;
    switch (boxOption) {
        case "acc0":
            account = window.account0;
            break;
        case "acc1":
            account = window.account1;
            break;
        case "acc2":
            account = window.account2;
            break;
        case "acc3":
            account = window.account3;
            break;
        case "acc4":
            account = window.account4;
            break;
    }
    return account;
}

const retreiveEthBalanceBox = function (account) {
    let box;
    switch (account) {
        case window.account0:
            box = "#balance0";
            break;
        case window.account1:
            box = "#balance1";
            break;
        case window.account2:
            box = "#balance2";
            break;
        case window.account3:
            box = "#balance3";
            break;
        case window.account4:
            box = "#balance4";
            break;
    }
    return box;
}

const retreiveSplitterBalanceBox = function (account) {
    let box;
    switch (account) {
        case window.account0:
            box = "#splitterBalance0";
            break;
        case window.account1:
            box = "#splitterBalance1";
            break;
        case window.account2:
            box = "#splitterBalance2";
            break;
        case window.account3:
            box = "#splitterBalance3";
            break;
        case window.account4:
            box = "#splitterBalance4";
            break;
    }
    return box;
}

const prepareArguments = function (buttonNumber) {
    let account1, account2, accountFrom, etherAmount;
    switch(buttonNumber) {
        case 0:
            account1 = retreiveAccount($("#account01").val());
            account2 = retreiveAccount($("#account02").val());
            accountFrom = window.account0;
            etherAmount = $("input[name='amount0']").val();
            break;
        case 1:
            account1 = retreiveAccount($("#account11").val());
            account2 = retreiveAccount($("#account12").val());
            accountFrom = window.account1;
            etherAmount = $("input[name='amount1']").val();
            break;
        case 2:
            account1 = retreiveAccount($("#account21").val());
            account2 = retreiveAccount($("#account22").val());
            accountFrom = window.account2;
            etherAmount = $("input[name='amount2']").val();
            break;
        case 3:
            account1 = retreiveAccount($("#account31").val());
            account2 = retreiveAccount($("#account32").val());
            accountFrom = window.account3;
            etherAmount = $("input[name='amount3']").val();
            break;
        case 4:
            account1 = retreiveAccount($("#account41").val());
            account2 = retreiveAccount($("#account42").val());
            accountFrom = window.account4;
            etherAmount = $("input[name='amount4']").val();
            break;
    } 
    return {account1: account1,
            account2: account2,
            accountFrom: accountFrom,
            etherAmount: etherAmount
    }
}

const split = function(event) {
    const gas = 300000; let deployed;
    const arguments = prepareArguments(event.data.buttonNumber);
    const account1 = arguments.account1;
    const account2 = arguments.account2;
    const accountFrom = arguments.accountFrom;
    const etherAmount = arguments.etherAmount;
    return Splitter.deployed()
        .then(_deployed => {
            deployed = _deployed;
            return _deployed.split.call(account1, account2,
  				  {from: accountFrom, value:web3.toWei(etherAmount), gas: gas})
        })
        .then(success => {
        	if (!success) {
                throw new Error("The transaction will fail anyway, not sending");
            }
            return deployed.split.sendTransaction(account1,account2,
                {from: accountFrom, value:web3.toWei(etherAmount), gas: gas})
		})
        .then(txHash => {
            $("#status").html("Transaction on the way " + txHash);
            const tryAgain = () => web3.eth.getTransactionReceiptPromise(txHash)
                .then(receipt => receipt !== null ?
                    receipt :
                    Promise.delay(1000).then(tryAgain));
            return tryAgain();
        })
        .then(receipt => {
            if (parseInt(receipt.status) != 1) {
                console.error("Wrong status");
                console.error(receipt);
                $("#status").html("There was an error in the tx execution, status not 1");
            } else if (receipt.logs.length == 0) {
                console.error("Empty logs");
                console.error(receipt);
                $("#status").html("There was an error in the tx execution");
            } else {
                $("#status").html("Split executed");
            }
            return web3.eth.getBalancePromise(accountFrom);
        })
        .then(balance => {
            ethBalance = web3.fromWei(balance,"ether");
            const box = retreiveEthBalanceBox(accountFrom);
            $(box).html(ethBalance.toString(10));
            return deployed.balances.call(account1);
        })
        .then(balance => {
            ethBalance = web3.fromWei(balance,"ether");
            const box = retreiveSplitterBalanceBox(account1);
            $(box).html(ethBalance.toString(10));
            return deployed.balances.call(account2);
        })
        .then(balance => {
            ethBalance = web3.fromWei(balance,"ether");
            const box = retreiveSplitterBalanceBox(account2);
            $(box).html(ethBalance.toString(10));
        })
        .catch(e => {
            $("#status").html(e.toString());
            console.error(e);
        });
};

const prepareWithdraw = function (buttonNumber) {
    let account;
    switch (buttonNumber) {
        case 0:
            account = window.account0;
            break;
        case 1:
            account = window.account1;
            break;            
        case 2:
            account = window.account2;    
            break;
        case 3:
            account = window.account3;    
            break;
        case 4:
            account = window.account4;    
            break;
    }
    return account;
}

const withdraw = function(event) {
    const gas = 300000; let deployed;
    const accountFrom = prepareWithdraw(event.data.buttonNumber);
    return Splitter.deployed()
    .then(_deployed => {
        deployed = _deployed;
        return _deployed.withdraw.call({from: accountFrom, gas: gas})
    })
    .then(success => {
        if (!success) {
            throw new Error("The transaction will fail anyway, not sending");
        }
        return deployed.withdraw.sendTransaction({from: accountFrom, gas: gas})
    })
    .then(txHash => {
        $("#status").html("Transaction on the way " + txHash);
        const tryAgain = () => web3.eth.getTransactionReceiptPromise(txHash)
            .then(receipt => receipt !== null ?
                receipt :
                Promise.delay(1000).then(tryAgain));
        return tryAgain();
    })
    .then(receipt => {
        if (parseInt(receipt.status) != 1) {
            console.error("Wrong status");
            console.error(receipt);
            $("#status").html("There was an error in the tx execution, status not 1");
        } else if (receipt.logs.length == 0) {
            console.error("Empty logs");
            console.error(receipt);
            $("#status").html("There was an error in the tx execution");
        } else {
            $("#status").html("Withdraw executed");
        }
        return web3.eth.getBalancePromise(accountFrom);
    })
    .then(balance => {
        ethBalance = web3.fromWei(balance,"ether");
        const box = retreiveEthBalanceBox(accountFrom);
        $(box).html(ethBalance.toString(10));
        return deployed.balances.call(accountFrom);
    })
    .then(balance => {
        ethBalance = web3.fromWei(balance,"ether");
        const box = retreiveSplitterBalanceBox(accountFrom);
        $(box).html(ethBalance.toString(10));
    })    
    .catch(e => {
        $("#status").html(e.toString());
        console.error(e);
    });
};
