
const KittyMarketPlace = artifacts.require("KittyMarketPlace");
const Kittycontract = artifacts.require("Kittycontract");
const truffleAssert = require("truffle-assertions");

contract("Kittycontract", async (accounts)=> {
  let instance;

  beforeEach(async () => {
    instance = await Kittycontract.new("Suveett's Kitties","Meoww-Cats");

  })


  it("Shouldn't Allow Non Owner to createKittyGen0", async() => {
    await truffleAssert.fails(instance.createKittyGen0(1234, {from: accounts[1]}), truffleAssert.ErrorType.REVERT)
  })
  it("Should Set All Kitty Mappings correctly", async()=> {
    await truffleAssert.passes(instance.createKittyGen0(1234, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
    let kitty = await instance.getKitty(0)
    assert(kitty._genes.toNumber() === 1234, kitty._mumId.toNumber() === 0, kitty._dadId.toNumber() === 0, kitty._generation.toNumber() === 0, "Mappings not Set Correctly" )
  })
  it("Should Set All Kitty Mappings correctly even for 16 digit genes", async()=> {
    await truffleAssert.passes(instance.createKittyGen0("1234567890123456", {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
    let kitty = await instance.getKitty(0)
    assert(kitty._genes.toNumber() === 1234567890123456, kitty._mumId.toNumber() === 0, kitty._dadId.toNumber() === 0, kitty._generation.toNumber() === 0, "Mappings not Set Correctly" )
  })
  it("Should show Correct balance of Owner", async() => {
    await truffleAssert.passes(instance.createKittyGen0(1234, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
    await truffleAssert.passes(instance.createKittyGen0(12345, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
    let balance = await instance.balanceOf(accounts[0])
    assert(balance.toNumber() === 2, "Balance of owner not showing Correctly")
  })
  it("Should show Correct Total Supply of Kitties", async() => {
    await truffleAssert.passes(instance.createKittyGen0(1234, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
    await truffleAssert.passes(instance.createKittyGen0(12345, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
    let totalSupply = await instance.totalSupply()
    assert(totalSupply.toNumber() === 2, "Total Supply not showing Correctly")
  })
  it("Should display ownershipCertificate and tokenOwnershipCount Mappings correctly", async()=> {
    await truffleAssert.passes(instance.createKittyGen0(1234, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
    await truffleAssert.passes(instance.createKittyGen0(12345, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
    let owner = await instance.ownerOf(0)
    console.log("Owner of Kitty 1: " + owner)
    let sameOwner = await instance.ownerOf(1)
    console.log("Owner of Kitty 2 : " + sameOwner)
    let result = await instance.balanceOf(owner)
    console.log(result.toNumber())
    assert(owner == accounts[0] && sameOwner == accounts[0] && owner === sameOwner, "Correct Owner not Showing")
   })
   it("Allow Anyone to be able to Transfer Kitty ", async()=> {
     await truffleAssert.passes(instance.createKittyGen0(1234, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
     await truffleAssert.passes(instance.createKittyGen0(12345, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
     await truffleAssert.passes(instance.transfer(accounts[1], 0, {from: accounts[0]}),truffleAssert.ErrorType.REVERT)
     /**await truffleAssert.passes(instance.transfer(accounts[1]), 1, {from: accounts[0]},truffleAssert.ErrorType.REVERT)
     await truffleAssert.passes(instance.transfer(accounts[2],1, {from: accounts[1]}),truffleAssert.ErrorType.REVERT)
     let owner1 = await instance.ownerOf(0)
     let owner2 = await instance.ownerOf(1)
     console.log("Owner of Kitty 1 :"  + owner1 + " & Owner of Kitty 2 :" + owner2)
     assert(owner1 != owner2, "Ownership didnt transfer")*/
   })

})


  contract("KittyMarketPlace", async (accounts)=> {
    let instance1;
    let instance2;



    beforeEach(async() => {

      instance1 = await Kittycontract.new("Suveett's Kitties","Meoww-Cats");
      instance2 = await KittyMarketPlace.new(instance1.address);

    })

    it("Allow Anyone to be able to Set Offer Himself after Operator approvals to Contract", async()=> {
      await truffleAssert.passes(instance1.createKittyGen0(1234, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
      await truffleAssert.passes(instance1.createKittyGen0(12345, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
      //await truffleAssert.passes(instance1.transfer(accounts[1], 0, {from: accounts[0]}),truffleAssert.ErrorType.REVERT)
      //await truffleAssert.passes(instance1.transfer(accounts[1], 1, {from: accounts[0]}),truffleAssert.ErrorType.REVERT)
      await truffleAssert.passes(instance1.setApprovalForAll(instance2.address, true, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
      await truffleAssert.passes(instance2.setOffer(web3.utils.toWei("2","ether"), 0, {from : accounts[0]}),truffleAssert.ErrorType.REVERT)
      //await truffleAssert.passes(instance2.setOffer(web3.utils.toWei("1","ether"), 1, {from : accounts[0]}),truffleAssert.ErrorType.REVERT)
      await truffleAssert.passes(instance2.buyKitty(0, {value: web3.utils.toWei("2", "ether"), from: accounts[3]}),truffleAssert.ErrorType.REVERT)
      //await truffleAssert.passes(instance2.buyKitty(1, {value: web3.utils.toWei("1", "ether"), from: accounts[3]}),truffleAssert.ErrorType.REVERT)

      let owner1 = await instance1.ownerOf(0)
      //let owner2 = await instance1.ownerOf(1)
      console.log('Owner of Kitty0 which has been recently sold :' + owner1) //" & Owner of Kitty1 is : " + owner2)
      //assert(owner1 == accounts[3] && owner2 == accounts[3] && owner === sameOwner, "Correct Owner not Showing")
  })

  it("Allow Anyone to Approve Anyone Else & to Set Offer/Get Offer/Sell/Buy Kitty", async() => {
      await truffleAssert.passes(instance1.createKittyGen0(1234, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
      await truffleAssert.passes(instance1.createKittyGen0(12345, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)
      //await truffleAssert.passes(instance1.transfer(accounts[1], 0, {from: accounts[0]}),truffleAssert.ErrorType.REVERT)
      //await truffleAssert.passes(instance1.transfer(accounts[1], 1, {from: accounts[0]}),truffleAssert.ErrorType.REVERT)
      await truffleAssert.passes(instance1.approve(accounts[2], 0, {from : accounts[0]}),truffleAssert.ErrorType.REVERT);
      await truffleAssert.passes(instance1.setApprovalForAll(instance2.address, true, {from:accounts[0]}),truffleAssert.ErrorType.REVERT)

      //Now MarketPlace instance functions below:
      await truffleAssert.passes(instance2.setOffer(web3.utils.toWei("1","ether"), 1, {from : accounts[0]}),truffleAssert.ErrorType.REVERT)
      await truffleAssert.passes(instance2.setOffer(web3.utils.toWei("2","ether"), 0, {from : accounts[0]}),truffleAssert.ErrorType.REVERT)
      let result1 = await instance2.getOffer(0)
      let result2 = await instance2.getOffer(1)
      console.log("Offer Details of Kitty 1 are : " + result1 + " & Offer Details of Kitty 2 are : " + result2)
      await instance2.buyKitty(0, {value: web3.utils.toWei("2", "ether"), from: accounts[3]})
      await instance2.buyKitty(1, {value: web3.utils.toWei("1", "ether"), from: accounts[3]})

      //again testing ownerOf using Kittycontract functions:
      let owner1 = await instance1.ownerOf(0)
      let owner2 = await instance1.ownerOf(1)
      assert(owner1 == accounts[3] && owner2 == accounts[3] && owner1 === owner2, "Kitty Owner is not correct")
    })


})
