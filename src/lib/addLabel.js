const { splitIntoLinesByCharacter, splitIntoLinesByWord } = require('./splitIntoLines')
const enums = require('./enums')

const horizontalRenderer = require('./render/horizontal')

const addLabel = ({
  parentContainer,
  text = 'test label',
  fontSize = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  fontColor = '#000000',
  bounds = { width: 100, height: 100 },
  maxLines = null,
  orientation = enums.orientation.HORIZONTAL,
  wrap = enums.wrap.WORD,
  verticalAlignment = enums.verticalAlignment.TOP,
  horizontalAlignment = enums.verticalAlignment.CENTER,
  innerLinePadding = 1,
}) => {
  // TODO INPUT VALIDATION

  const wrapFunction = (wrap === enums.wrap.WORD)
    ? splitIntoLinesByWord
    : splitIntoLinesByCharacter

  const lines = wrapFunction({
    parentContainer,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    maxWidth: bounds.width,
    maxHeight: bounds.height,
    maxLines,
    orientation,
  })

  horizontalRenderer({
    parentContainer,
    lines,
    fontSize,
    fontFamily,
    fontWeight,
    fontColor,
    bounds,
    verticalAlignment,
    horizontalAlignment,
    innerLinePadding,
  })
}

module.exports = {
  addLabel,
}
