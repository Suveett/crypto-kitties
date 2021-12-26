

//This function changes the color of Head and Chest
function headColor(code,idCat = "") {
    $(`${idCat}.cat__head, ${idCat}.cat__chest`).css('background', '#' + colors[code])  //This changes the color of the cat
    $(`${idCat}#dnabody`).html(code) //This updates the body color part of the DNA that is displayed below the cat


}

// This function changes the color of Mouth and tail
function mouthColor(code,idCat = ""){
  $(`${idCat}.cat__mouth-left, ${idCat}.cat__mouth-right, ${idCat}.cat__tail`).css('background', '#' + colors[code]) //This changes the Cat's Mouth and Tail Colors
  $(`${idCat}#dnamouth`).html(code) // This updates the Mouth and Tail color part of the DNA that is displayed below the cat

}

//This function changes the color of Cat's eyes
function eyesColor(code, idCat = ""){
  $(`${idCat}.cat__eye span.pupil-left, ${idCat}.cat__eye span.pupil-right`).css('background', '#' + colors[code]) //This changes the Cat's Mouth and Tail Colors
  $(`${idCat}#dnaeyes`).html(code) // This updates the Mouth and Tail color part of the DNA that is displayed below the cat


}

//This function changes the color of Cat's ears and Paws
function earsColor(code, idCat = ""){
  $(`${idCat}.cat__ear--left, ${idCat}.cat__ear--right, ${idCat}.cat__paw-left, ${idCat}.cat__paw-right`).css('background', '#' + colors[code]) //This changes the Cat's ears Colors
  $(`${idCat}#dnaears`).html(code) //This updates the Ears color part of the DNA that is displayed below the Cat


}

//###################################################
//USING BELOW FUNCTIONS TO CHANGE CATTRIBUTES
//###################################################

//Changing Eye shapes
function eyeVariation(num, idCat = "") {
    normalEyes(idCat) //Reset eyes
    $(`${idCat}#dnashape`).html(num)//This updates the Eyes shape part of the DNA that is displayed below the Cat
    eyeVariations[num].setEyesFunc(idCat)
}
//########################################################################################
  //  switch (num) {
  //      case 1:
  //          normalEyes()
  //          $('#eyename').html('Basic Eyes')// Set the badge of the eye to 'Basic'
  //          break
  //      case 2:
  //          normalEyes()//reset
  //          $('#eyename').html('Chill Eyes')//Set the badge to "Chill"
  //          eyesType1()//Change the eye shape by bringing a Solid border-top 15 px
  //          break
  //      case 3:
  //          normalEyes()//reset
  //          $('#eyename').html('Smile Eyes')//Set the badge to "Smile"
  //          eyesType2()//Change the eye shape by bringing a Solid border- bottom15 px
  //          break
  //      case 4:
  //          normalEyes()//reset
  //          $('#eyename').html('Cool Eyes')//Set the badge to "Cool"
  //          eyesType3()//Change the eye shape by bringing a Solid border-right 15 px
  //          break
  //      case 5:
  //          normalEyes()//reset
  //          $('#eyename').html('Dotted Eyes')//Set the badge to "Dotted Eyes"
  //          eyesType4()//Change the eye shape by bringing a border-style: dotted
  //          break
  //  }




function normalEyes(idCat) {
    //Reset eye Lids to fully open
    $(`${idCat}.cat__eye`).find('span').css('border', 'none')
    // Reset pupil to round and centered
    $(`${idCat} .cat__eye`).find('span').css('width', '42px')
    $(`${idCat} .pupil-left`).css('left', '42px')
    $(`${idCat} .pupil-right`).css('left', '166px')
}

function eyesType1(idCat) {
    $(`${idCat}.cat__eye`).find('span').css('border-top', '15px solid')
}

function eyesType2(idCat) {
    $(`${idCat}.cat__eye`).find('span').css('border-bottom', '15px solid')
}

function eyesType3(idCat) {
    $(`${idCat}.cat__eye`).find('span').css('border-right', '15px solid')
}

function eyesType4(idCat) {
    $(`${idCat}.cat__eye`).find('span').css('border-style', 'Dotted')
}

//###################################################################################

//Changing Cat BirthMark Dimensions + Rotation
function decorationVariation(num, idCat="") {
  normalDecoration(idCat)
  $(`${idCat} #dnadecoration`).html(num)   // Update DNA display (below cat)
  decorationVariations[num].setDecorationFunc(idCat)
}

//#########################################################################################
  //  switch (num) {
  //    case 1:
  //          normalDecoration()
  //          $('#decorationname').html('Basic Forehead Patches')// Set the Badge to Decoration pattern Basic
  //          break
  //      case 2:
  //          normalDecoration()
  //          $('#decorationname').html('Angled Forehead Patches')// Set the Badge to Decoration pattern - Angled patches
  //          normalDecoration1()
  //          break
  //      case 3:
  //          normalDecoration()
  //          $('#decorationname').html('Smaller Forehead Width Patches')// Set the Badge to Decoration pattern - Smaller Patches
  //          normalDecoration2()
  //          break
  //      case 4:
  //          normalDecoration()
  //          $('#decorationname').html('Smaller Forehead Height Patches')// Set the Badge to Decoration pattern - Smaller Patches
  //          normalDecoration3()
  //          break
  //  }




function normalDecoration(idCat) {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $(`${idCat}.cat__head-dots`).css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $(`${idCat}.cat__head-dots_first`).css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $(`${idCat}.cat__head-dots_second`).css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}


function normalDecoration1(idCat) {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $(`${idCat}.cat__head-dots`).css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $(`${idCat}.cat__head-dots_first`).css({ "transform": "rotate(45deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $(`${idCat}.cat__head-dots_second`).css({ "transform": "rotate(-45deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}

function normalDecoration2(idCat) {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $(`${idCat}.cat__head-dots`).css({ "transform": "rotate(0deg)", "height": "48px", "width": "8px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $(`${idCat}.cat__head-dots_first`).css({ "transform": "rotate(0deg)", "height": "35px", "width": "8px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $(`${idCat}.cat__head-dots_second`).css({ "transform": "rotate(0deg)", "height": "35px", "width": "8px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}

function normalDecoration3(idCat) {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $(`${idCat}.cat__head-dots`).css({ "transform": "rotate(0deg)", "height": "24px", "width": "8px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $(`${idCat}.cat__head-dots_first`).css({ "transform": "rotate(0deg)", "height": "20px", "width": "8px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $(`${idCat}.cat__head-dots_second`).css({ "transform": "rotate(0deg)", "height": "20px", "width": "8px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}

//########################################################################################################

//This changes the Side BirthMark Colors
function sidesDecorationColor(code, idCat= "") {
    $(`${idCat}.cat__head-dots_first , ${idCat}.cat__head-dots_second`).css('background', '#' + colors[code])  //This changes the color of the cat's Side BirthMark
    $(`${idCat}#dnadecorationSides`).html(code) //This updates the Side Birthmarks color part of the DNA that is displayed below the cat
}

//This changes the Mid BirthMark colors
function midDecorationColor(code, idCat ="") {
    $(`${idCat}.cat__head-dots`).css('background', '#' + colors[code])  //This changes the color of the cat's Mid Birthmark
    $(`${idCat}#dnadecorationMid`).html(code) //This updates the Mid Birthmark color part of the DNA that is displayed below the cat
  }


//#################################################################################################################
//This Function changes the animation style
function animationStyle(num,idCat = ""){
  resetAnimation(idCat) //Reset animations
  $(`${idCat} #dnaanimation`).html(num)   // Update DNA display (below cat)
  animationVariations[num].setAnimationFunc(idCat)
}

//#################################################################################################################
//  switch (num) {
//    case 1 :
//    movingHeadAnimation()
//    $('#animationcode').html('Moving Head')//It sets the Badge to Moving Head style
//    break
//    case 2 :
//    bigHeadAnimation()
//    $('#animationcode').html('Big Head') // It sets the Badge to Scaled Head style
//    break
//    case 3 :
//    translatedHeadAnimation()
//    $('#animationcode').html("Translated Head")//It setsthe  Badge to Transitioned/Transported Head style
//    break
//    case 4 :
//    movingTailAnimation()
//    $('#animationcode').html('Moving Tail')// It sets the badge to Moving Tail animation style
//    break
//  }




function animationType1(idCat) {  //Head rotates and moves
  $(`${idCat}#head`).addClass('movingHead')
}

function animationType2(idCat) {  //Head gets scaled
  $(`${idCat}#head`).addClass('scalingHead')

}


function animationType3(idCat) { //Head gets translated
  $(`${idCat}#head`).addClass('translatingHead')
}


function animationType4(idCat) { //Tail starts Moving
  $(`${idCat}#tail`).addClass('movingTail')
}

function resetAnimation(idCat){
  $(`${idCat}#head`).removeClass('movingHead')
  $(`${idCat}#head`).removeClass('scalingHead')
  $(`${idCat}#head`).removeClass('translatingHead')
  $(`${idCat}#tail`).removeClass('movingTail')


}
