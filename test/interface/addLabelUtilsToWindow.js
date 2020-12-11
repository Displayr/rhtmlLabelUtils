const { getSingleLineLabelDimensions, splitIntoLines, addLabel, enums }  = require('../../src')
const testCases = require('../data')

document.addEventListener('DOMContentLoaded', () => {
  window.labelUtils = {
    getSingleLineLabelDimensions,
    splitIntoLines,
    addLabel,
    enums,
  }
  window.testCases = testCases
}, false)
