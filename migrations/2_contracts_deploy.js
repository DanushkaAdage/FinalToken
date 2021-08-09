const SafeMath = artifacts.require("FinalToken");
const FinalToken = artifacts.require("FinalToken");

module.exports = function (deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(FinalToken);
};
