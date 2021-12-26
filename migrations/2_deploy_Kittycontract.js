const Utilities = artifacts.require("ArrayUtils")
const Kittycontract = artifacts.require("Kittycontract")


module.exports = function(deployer) {
  //let UTILITIES_INSTANCE = await deployer.deploy(Utilities)
  deployer.deploy(Utilities);
  deployer.link(Utilities, Kittycontract)
  //let KITTY_CONTRACT_INSTANCE = await deployer.deploy(Kittycontract,"cats-Purrr", "Meoww-Kitties")
  deployer.deploy(Kittycontract,"cats-Purrr", "Meoww-Kitties")

}
