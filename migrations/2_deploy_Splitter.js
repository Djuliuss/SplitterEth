var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
	deployer.deploy(Splitter,{gas:5000000});
};

