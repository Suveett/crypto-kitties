


function getDna(){
  try {
    let dna = ''
    dna += $('#dnabody').html()
    dna += $('#dnamouth').html()
    dna += $('#dnaeyes').html()
    dna += $('#dnaears').html()
    dna += $('#dnashape').html()
    dna += $('#dnadecoration').html()
    dna += $('#dnadecorationMid').html()
    dna += $('#dnadecorationSides').html()
    dna += $('#dnaanimation').html()
    dna += $('#dnaspecial').html()

    if (dna.length !== 16 ) throw `DNA string ('${dna}') length should be 16 (not ${dna.length} digits)`

    return BigInt(dna)
  }
  catch (error) {
    console.log(`Error In getDna(): ${error}`)
  }
}


function renderCat(cat, idCat=""){
  try {
    headColor(cat.dna.headColor, idCat)
    mouthColor(cat.dna.mouthColor, idCat)
    eyesColor(cat.dna.eyesColor, idCat)
    earsColor(cat.dna.earsColor, idCat)
    eyeVariation(cat.dna.eyesShape, idCat)
    decorationVariation(cat.dna.decorationPattern, idCat)
    midDecorationColor(cat.dna.decorationMidColor, idCat)
    sidesDecorationColor(cat.dna.decorationSidesColor, idCat)
    animationStyle(cat.dna.animation, idCat)

    // Display Special DNA digit
    $(`${idCat} #dnaspecial`).html(cat.dna.lastNum) // Update DNA display (below cat)

    // Display Cats' Generation
    $(`${idCat}`).find('#catGenNum').html(cat.gen)

    // Display Cats' Price (if it has one)
    if (cat.price) $(`${idCat}`).find('#catPrice').html("PRICE: " + cat.price + " ETH")

    // Display Cats' status
//    $(`${idCat}`).find('#catStatus').html("TEST")

  }
  catch (error){
    console.log(`Error In renderCat, idCat=""): ${error}`)
  }
}


function updateSliders(dna){
  try {
    $('#bodycolor').val(dna.headColor)             //Update slider's value
    $('#headcode').html('code: '+dna.headColor)    //Update slider's badge

    $('#mouthcolor').val(dna.mouthColor)
    $('#mouthcode').html('code: '+dna.mouthColor)

    $('#eyescolor').val(dna.eyesColor)
    $('#eyescode').html('code: '+dna.eyesColor)

    $('#earscolor').val(dna.earsColor)
    $('#earscode').html('code: '+dna.earsColor)

    $('#eyesshape').val(dna.eyesShape)
    $('#eyename').html(eyeVariations[dna.eyesShape].name)

    $('#decorationpattern').val(dna.decorationPattern)
    $('#decorationname').html(decorationVariations[dna.decorationPattern].name)

    $('#decorationmidcolor').val(dna.decorationMidColor)
    $('#midbirthmarkcode').html('code: '+dna.decorationMidColor)

    $('#decorationsidescolor').val(dna.decorationSidesColor)
    $('#sidebirthmarkscode').html('code: '+dna.decorationSidesColor)

    $('#animationstyle').val(dna.animation)
    $('#animationcode').html(animationVariations[dna.animation].name)
  }
  catch (error){
    console.log(`Error In updateSliders(dna): ${error}`)
  }
}


//EVENT LISTENERS

// Changing cat's Body' colors
$('#bodycolor').change(()=>{
    var colorVal = $('#bodycolor').val()
    $('#headcode').html('code: '+ colorVal) //This updates text of the badge next to the slider
    headColor(colorVal)


})

// Changing Cat's Mouth color
$('#mouth_tail_color').change(()=>{
  var colorVal = $('#mouth_tail_color').val()
  $('#mouthcode').html('code: ' + colorVal) // This updates text of the badge next to the slider
  mouthColor(colorVal)


})

//Changing cat's eyes color
$('#eyescolor').change(()=>{
  var colorVal = $('#eyescolor').val()
  $('#eyescode').html('code: ' + colorVal) // This updates text of the badge next to the slider
  eyesColor(colorVal)

})

//Changing cat's ears colors
$('#earscolor').change(()=>{
  var colorVal = $('#earscolor').val()
  $('#earscode').html('code: ' + colorVal) // This updates text of the badge next to the slider
  earsColor(colorVal)

})

//Changing Cat eyes Shape
$('#eyesshape').change(()=>{
  var shape = parseInt($('#eyesshape').val())
  $('#eyename').html(eyeVariations[shape].name)
  eyeVariation(shape)

})

//Changing Decoration pattern
$('#decorationpattern').change(()=>{
  var pattern = parseInt($('#decorationpattern').val())
  $('#decorationname').html(decorationVariations[pattern].name)
  decorationVariation(pattern)
})

//Changing The Side & Mid Birthmarks colors
$('#decorationsidescolor').change(()=>{
  var colorVal = $('#decorationsidescolor').val()
  $('#sidebirthmarkscode').html('code: '+ colorVal) //This updates text of the badge next to the slider
  sidesDecorationColor(colorVal)
})
$('#decorationmidcolor').change(()=>{
  var colorVal = $('#decorationmidcolor').val()
  $('#midbirthmarkcode').html('code: '+ colorVal) //This updates text of the badge next to the slider
  midDecorationColor(colorVal)
})

//Changing the Animation Style :
$('#animationstyle').change(()=>{
  var animationVal = parseInt($('#animationstyle').val())
  $('#animationcode').html(animationVariations[animationVal].name)
  animationStyle(animationVal)
})


//    var colorVal = Math.floor(Math.random() * 89) + 10
//    headColor(colors[colorVal],colorVal)

//    var colorVal = Math.floor(Math.random() * 89) + 10
//    mouthColor(colors[colorVal],colorVal)

//    var colorVal = Math.floor(Math.random() * 89) + 10
//    eyesColor(colors[colorVal],colorVal)

//    var colorVal = Math.floor(Math.random() * 89) + 10
//    earsColor(colors[colorVal],colorVal)

//    var shape = Math.floor(Math.random() * 5) + 1
//    eyeVariation(shape)

//    var pattern = Math.floor(Math.random() * 4) + 1
//    decorationVariation(pattern)

//    var colorVal = Math.floor(Math.random() * 89) + 10
//    sidesDecorationColor(colors[colorVal],colorVal)

//    var colorVal = Math.floor(Math.random() * 89) + 10
//    midDecorationColor(colors[colorVal],colorVal)

//    var animationVal = Math.floor(Math.random() * 4) + 1
//    animationStyle(animationVal)
//})
