const _ = require('lodash')
const enums = require('./enums')
const getSingleLineLabelDimensions = require('./getSingleLineLabelDimensions')
const { splitIntoLines } = require('./splitIntoLines')
const validateFontSizeAndConvertNumeric = require('../utils/validateFontSizeAndConvertNumeric')

const getDimensions = ({
  parentContainer,
  text = 'test label',
  fontSize: fontSizeStringOrNumber = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  maxWidth = null,
  maxHeight = null,
  maxLines = null,
  orientation = enums.orientation.HORIZONTAL,
  wrap = enums.wrap.WORD,
  innerLinePadding = 1,
}) => {
  const fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber)

  const lines = splitIntoLines({
    parentContainer,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    maxWidth,
    maxHeight,
    maxLines,
    orientation,
    wrap,
    innerLinePadding,
  })

  const lineDimensions = lines.map(text => getSingleLineLabelDimensions({
    parentContainer,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    orientation,
    wrap,
    innerLinePadding,
  }))

  switch(orientation) {
    case enums.orientation.HORIZONTAL:
      return {
        width: _(lineDimensions).map('width').max(),
        height: _(lineDimensions).map('height').sum() + (lines.length - 1) * innerLinePadding,
      }
    case enums.orientation.TOP_TO_BOTTOM:
      return {
        width: _(lineDimensions).map('width').sum() + (lines.length - 1) * innerLinePadding,
        height: _(lineDimensions).map('height').max(),
      }
    case enums.orientation.BOTTOM_TO_TOP:
      return {
        width: _(lineDimensions).map('width').sum() + (lines.length - 1) * innerLinePadding,
        height: _(lineDimensions).map('height').max(),
      }
    default: throw new Error(`unknown orientation: '${orientation}'`)
  }
}

module.exports = getDimensions