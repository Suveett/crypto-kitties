var colors = Object.values(allColors())

const defaultDNA = {
    "headColor" : 10,
    "mouthColor" : 13,
    "eyesColor" : 96,
    "earsColor" : 10,
    //Cattributes
    "eyesShape" : 1,
    "decorationPattern" : 1,
    "decorationMidColor" : 13,
    "decorationSidesColor" : 13,
    "animation" : 0,
    "lastNum" : 1
    }

const defaultCat = {
    id: "",
    dna: defaultDNA,
    gen: ""
}

const eyeVariations = [
    {
      "name" : "Basic Eyes",
      "setEyesFunc" : normalEyes
    },
    {
      "name" : "Smiling Eyes",
      "setEyesFunc" : eyesType1
    },
    {
        "name" : "Shy Girl eyes",
        "setEyesFunc" : eyesType2
    },
    {
        "name" : "Chill",
        "setEyesFunc" : eyesType3
    },
    {
        "name" : "Dotted Eyes",
        "setEyesFunc" : eyesType4
    }
  ]

const decorationVariations = [
    {
        "name" : "Standard Stripes",
        "setDecorationFunc" : normalDecoration
    },
    {
        "name" : "Angular Stripes",
        "setDecorationFunc" : normalDecoration1
    },
    {
        "name" : "Big Stripes",
        "setDecorationFunc" : normalDecoration2
    },
    {
        "name" : "Small Stripes",
        "setDecorationFunc" : normalDecoration3
    }
]

const animationVariations = [
    {
        "name" : "Moving Head",
        "setAnimationFunc" : animationType1
    },
    {
        "name" : "Scaling Head",
        "setAnimationFunc" : animationType2
    },
    {
        "name" : "Translating Head",
        "setAnimationFunc" : animationType3
    },
    {
        "name" : "Moving Tail",
        "setAnimationFunc" : animationType4
    }
]
