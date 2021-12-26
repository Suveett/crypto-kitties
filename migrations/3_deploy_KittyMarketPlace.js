const Kittycontract = artifacts.require("Kittycontract");
const KittyMarketPlace = artifacts.require("KittyMarketPlace");


module.exports = function(deployer) {
//let MARKETPLACE_CONTRACT_INSTANCE = await deployer.deploy(KittyMarketPlace, Kittycontract.address)
  deployer.deploy(KittyMarketPlace,Kittycontract.address);  
}
