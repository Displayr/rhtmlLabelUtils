const { getSingleLineLabelDimensions, splitIntoLinesByWord, splitIntoLinesByCharacter, addLabel, enums }  = require('../../src')
const testCases = require('../data')

document.addEventListener('DOMContentLoaded', () => {
  window.labelUtils = {
    getSingleLineLabelDimensions,
    splitIntoLinesByWord,
    splitIntoLinesByCharacter,
    addLabel,
    enums,
  }
  window.testCases = testCases
}, false)
