const { getSingleLineLabelDimensions } = require('./lib/getSingleLineLabelDimensions')
const { splitIntoLinesByWord, splitIntoLinesByCharacter } = require('./lib/splitIntoLines')
const { addLabel } = require('./lib/addLabel')
const enums = require('./lib/enums')
module.exports = {
  getSingleLineLabelDimensions,
  splitIntoLinesByWord,
  splitIntoLinesByCharacter,
  addLabel,
  enums,
}
