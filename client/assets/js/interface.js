
var web3 = new Web3(Web3.givenProvider);
// console.log(web3.version)

const KITTY_CONTRACT_ADDRESS = "0x55BEB65de83a30a57705eaD3b713a238440d5bd7";
const MARKETPLACE_CONTRACT_ADDRESS = "0xC9F0d2934B6990C2ECD544205Fa38F8fFAa59424";
let KITTY_CONTRACT_INSTANCE;
let MARKETPLACE_CONTRACT_INSTANCE
let User;

async function initiateConnection(){
    try {
        // Prompt user to allow our website to use their metamask account to interact with the blockchain
        // window.ethereum.enable().then(function(accounts){
        //     instance = new web3.eth.Contract(abi.kittyContract, KITTY_CONTRACT_ADDRESS, {from: accounts[0]})
        //     User = accounts[0]
        // })

        let accounts = await window.ethereum.enable()
        KITTY_CONTRACT_INSTANCE = new web3.eth.Contract(abi.kittyContract, KITTY_CONTRACT_ADDRESS, {from: accounts[0]});
        MARKETPLACE_CONTRACT_INSTANCE = new web3.eth.Contract(abi.marketPlace, MARKETPLACE_CONTRACT_ADDRESS, {from: accounts[0]});
        User = accounts[0];

        if (User.length > 0) {
            console.log("Connected with account :" + User)
            return true
        }
    }
    catch (err) {
         console.log("Error from initiateConnection(): " + err)
         return false
    }
    //EVENT LISTENERS
    /**contractInstance.events.Birth()
    .on("data", function(event){
      console.log(event);
      let owner = event.returnValues.owner;
      let mumId = event.returnValues.mumId;
      let dadId = event.returnValues.dadId;
      let genes = event.returnValues.genes;
      let newKittenId = event.returnValues.newKittenId;


    })
    .on("error", function(err){
      console.log('Error :' + err);
    });*/
}


function isUser(address) {
    try {
        if (String(address).toLowerCase() !== String(User).toLowerCase()) return false
        return true
    }
    catch (err) {
        console.log("Error from isUser(address): " + err)
    }
}


// KittyContract Events

function onBirthEvent(uiCallbackFunc) {
    KITTY_CONTRACT_INSTANCE.events.Birth().on('data', function(event){
        uiCallbackFunc(event.returnValues)
    })
    .on('error', function(error, receipt) {
        console.log("Birth Event Error")
        console.log(error)
        console.log(receipt)
    })
}

// KittyContract Interface functions

async function getAllYourCatIds() {
    try {
        let catIds = []
        await KITTY_CONTRACT_INSTANCE.methods.getKittyByOwner.call({}, function(err, idsTokens){
            if (err) throw "Error from getAllYourKittyIds().call(): " + err
            catIds = idsTokens
        })
        return catIds
    }
    catch (error) {
        console.log("In getAllYourCatIds(): " + error)
    }
}


async function getDetailsAllCats(catIds) {
    try {
        let allCats = []
        for (let i = 0; i < catIds.length; i++) {
            const cat = await getCatDetails(catIds[i])
            allCats.push(cat)
        }
        return allCats
    }
    catch (error) {
        console.log("Error from getDetailsAllCats(catIds): " + error)
    }
}


async function getCatDetails(catId) {
    try {
        const cat = {
            id: catId,
            genes: undefined,
            gen: undefined,
            mumId: undefined,
            dadId: undefined,
            birthTime: undefined,
            dna: undefined , // added dna object (required by front-end)

        }

        await KITTY_CONTRACT_INSTANCE.methods.getKitty(catId).call({}, function(errMsg, kitty){
            if (errMsg) throw "Error from getKitty(catId).call(): " + errMsg
            cat.genes = kitty._genes
            cat.birthTime = kitty._birthTime
            cat.mumId = kitty._mumId
            cat.dadId = kitty._dadId
            cat.gen = kitty._generation

        })
        // Add further info as required by UI
        cat.dna = getKittyDna(cat._genes)

        return cat
    }
    catch (error) {
        console.log("Error from getCatDetails(catId): " + error)
    }
}


async function breedKitty(mumId, dadId){
    try {
        await KITTY_CONTRACT_INSTANCE.methods.breed(mumId, dadId).send({}, function(err, txHash){
            if (err) throw "Error returned from 'Instance_Of_KittyContract.methods.breed(mumId, dadId).send({}': " + err
            else {
                console.log(txHash)
                return txHash
            }
        })
    }
    catch (error) {
        console.log("In breedCats(): " + error)
    }
}



// Marketplace Contract Events

function onMarketplaceEvent(uiCallbackFunc) {
    MARKETPLACE_CONTRACT_INSTANCE.events.MarketTransaction().on('data', function(event){
        uiCallbackFunc(event.returnValues)
    })
    .on('error', function(error, receipt) {
        console.log("Market Transaction Event Error")
        console.log(error)
        console.log(receipt)
    })
}



// Marketplace Contract Interface functions

async function getAllCatIdsOnSale() {
    try {
        let catIdsOnSale = []
        await MARKETPLACE_CONTRACT_INSTANCE.methods.getAllTokenOnSale().call({}, function(err, catTokensOnSale){
            if (err) throw "Error from getAllTokenOnSale().call(): " + err
            for (i = 0; i < catTokensOnSale.length; i ++) {
              if(catTokensOnSale[i] != 0) {
                  catIdsOnSale[i] = catTokensOnSale[i];
              }
            }

        })
        return catIdsOnSale
    }
    catch (error) {
        console.log("In getAllCatIdsOnSale(): " + error)
    }
}


async function getDetailsOfAllCatsForSale(catIds) {
    try {
        let allCatsForSale = []

        for (let i = 0; i < catIds.length; i++) {
            const cat = await getCatDetails(catIds[i])
            const forSale = await getForSaleDetails(catIds[i])
            const catForSale = {...cat, ...forSale}
            allCatsForSale.push(catForSale)
        }
        return allCatsForSale
    }
    catch (error) {
        console.log("Error from getDetailsOfAllCatsForSale(catIds): " + error)
    }
}


async function isCatOnSale(catId) {
    try {
        let isOnSale
        await MARKETPLACE_CONTRACT_INSTANCE.methods.isTokenOnSale(catId).call({}, function(errMsg, onSale){
            if (errMsg) throw new Error(errMsg)
            isOnSale = onSale
        })
        return isOnSale
    }
    catch (error) {
        console.log("Error from isCatOnSale(catId): " + error)
        console.log("Defaulting to returning false ... continuing")
        return false
    }
}


async function getForSaleDetails(catId) {
    try {
        const forSaleDetails = {
            id: undefined,
            sellerAddress: undefined,
            priceInWei: undefined,
            active: undefined,
            price: undefined
        }

        await MARKETPLACE_CONTRACT_INSTANCE.methods.getOffer(catId).call({}, function(errMsg, offer){
                if (errMsg) throw new Error(errMsg)
                if (catId != offer.tokenId ) throw new Error(`Internal error - tokenId (${offer.tokenId}) returned by getOffer(catId) doesn't match catId (${catId})!?`)

                forSaleDetails.id = offer.tokenId
                forSaleDetails.sellerAddress = offer.seller
                forSaleDetails.priceInWei = offer.price
                forSaleDetails.active = offer.active

                // Convert wei price to ether
                forSaleDetails.price = web3.utils.fromWei(offer.price, 'ether')
        })
        return forSaleDetails
    }
    catch (error) {
        console.log("Error from getForSaleDetails(catId): " + error)
    }
}


async function setMarketplaceApproval(){
    try {
        const isMarketplaceAnOperator = await KITTY_CONTRACT_INSTANCE.methods.isApprovedForAll(User, MARKETPLACE_CONTRACT_ADDRESS).call()

        if (isMarketplaceAnOperator == false) {
            await KITTY_CONTRACT_INSTANCE.methods.setApprovalForAll(MARKETPLACE_CONTRACT_ADDRESS, true).send({}, function(err, txHash){
                if (err) console.log(err)
                else console.log(txHash)
            })

        }
    }
    catch (err) {
         console.log("Error from setMarketplaceApproval(): " + err)
         return false
    }
}


async function setForSale(catId, salePriceInWei) {
    try {
        await MARKETPLACE_CONTRACT_INSTANCE.methods.setOffer(salePriceInWei, catId).send({}, function(err, txHash){
            if (err) {
                throw(err)
            }
            else {
                console.log(txHash)
            }
        })
    }
    catch (err) {
        console.log("Error from setForSale(catId, salePriceInWei): " + err)
    }
}


async function withdrawFromSale(catId) {
    try {
        await MARKETPLACE_CONTRACT_INSTANCE.methods.removeOffer(catId).send({}, function(err, txHash){
            if (err) {
                throw(err)
            }
            else {
                console.log(txHash)
            }
        })
    }
    catch (err) {
        console.log("Error from withdrawFromSale(catId): " + err)
    }
}


async function buyKitty(tokenId, priceInWei) {
    try {
        await MARKETPLACE_CONTRACT_INSTANCE.methods.buyKitty(tokenId).send({value: priceInWei}, function(err, txHash){
            if (err) {
                throw(err)
            }
            else {
                console.log(txHash)
            }
        })
    }
    catch (err) {
        console.log("Error from buyKitty(tokenId): " + err)
    }
}
