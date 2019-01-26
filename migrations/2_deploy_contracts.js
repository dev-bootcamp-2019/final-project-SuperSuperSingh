var SafeMath = artifacts.require("./SafeMath.sol");
var MarketPlace = artifacts.require("./MarketPlace.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(MarketPlace);
};
