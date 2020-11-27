const { getSingleLineLabelDimensions, splitIntoLinesByWord, splitIntoLinesByCharacter, addLabel, enums }  = require('../../src')

document.addEventListener('DOMContentLoaded', () => {
  window.labelUtils = {
    getSingleLineLabelDimensions,
    splitIntoLinesByWord,
    splitIntoLinesByCharacter,
    addLabel,
    enums,
  }
}, false)
