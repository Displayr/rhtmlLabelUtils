const { splitIntoLinesByCharacter, splitIntoLinesByWord } = require('./splitIntoLines')
const enums = require('./enums')

const horizontalRenderer = require('./render/horizontal')
const topToBottomRenderer = require('./render/topToBottom')
const bottomToTopRenderer = require('./render/bottomToTop')

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
    innerLinePadding,
  })

  const renderer = getRenderer(orientation)
  renderer({
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

const getRenderer = orientation => {
  switch(orientation) {
    case enums.orientation.HORIZONTAL: return horizontalRenderer
    case enums.orientation.TOP_TO_BOTTOM: return topToBottomRenderer
    case enums.orientation.BOTTOM_TO_TOP: return bottomToTopRenderer
    default: throw new Error(`unknown orientation: '${orientation}'`)
  }
}

module.exports = {
  addLabel,
}
