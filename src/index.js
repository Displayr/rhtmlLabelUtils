const { getSingleLineLabelDimensions } = require('./lib/getSingleLineLabelDimensions')
const { splitIntoLinesByWord, splitIntoLinesByCharacter } = require('./lib/splitIntoLines')
const { addLabel, options } = require('./lib/addLabel')
module.exports = {
  getSingleLineLabelDimensions,
  splitIntoLinesByWord,
  splitIntoLinesByCharacter,
  addLabel,
  enums: options,
}
