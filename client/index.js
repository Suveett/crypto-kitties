// When page loads
$(document).ready(async function() {
    renderCat(defaultCat)

    // Connect website to user's metamask (to allow interaction with Kittie SC)
    const connected = await initiateConnection()
    if (connected != true) console.log("Not connected to contract")

    // Make Kitty-Factory accessable only to KittyContract owner
    //await isOwnerOfKittyContract() ? showFactoryLink() : hideFactoryLink()
    getDefaultKittie();
    onBirthEvent(displayBirth);

  });





function getDefaultKittie() {
  try {
    renderCat(defaultCat);
    updateSliders(defaultCat.dna);
  }
  catch (error)
  {
    console.log(`Error In getDefaultKittie(): ${error}`)
  }
}


function getRandomKittie() {
  try {
    const randomCat = {
      id: "",
      gen: "",
      dna: {
        "headColor" : getRandomIntegerBetween(10, 98),
        "mouthColor" : getRandomIntegerBetween(10, 98),
        "eyesColor" : getRandomIntegerBetween(10, 98),
        "earsColor" : getRandomIntegerBetween(10, 98),
        //Cattributes
        "eyesShape" : getRandomIntegerBetween(0, 4),
        "decorationPattern" : getRandomIntegerBetween(0, 3),
        "decorationMidColor" : getRandomIntegerBetween(10, 98),
        "decorationSidesColor" : getRandomIntegerBetween(10, 98),
        "animation" :  getRandomIntegerBetween(0, 3),
        "lastNum" :  getRandomIntegerBetween(0,9)
      }
    }

    renderCat(randomCat)
    updateSliders(randomCat.dna)
  }
  catch (error)
  {
    console.log(`Error In getRandomKittie(): ${error}`)
  }
}

function createKittie(){
  try {
    const dnaStr = getDna().toString()
    KITTY_CONTRACT_INSTANCE.methods.createKittyGen0(dnaStr).send({}, function(err, txHash){
        if (err) console.log(err)
        else console.log(txHash)
    })
  }
  catch(error){
    console.log(`Error In createKittie: ${error}`)
  }
}
