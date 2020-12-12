const getSingleLineLabelDimensions = require('../getSingleLineLabelDimensions')
const { orientation: { HORIZONTAL, NORTH_EAST, SOUTH_EAST }, wrap } = require('../enums')
const validateFontSizeAndConvertNumeric = require('../../utils/validateFontSizeAndConvertNumeric')

// TODO the _splitIntoLines needs a cleanup, but first it needs some test coverage
// I have not really touched this file (yet) since extracting it into labelUtils repo

// NB not sure if this will work. Depends if font rendering is same size wise horizontal vs vertical
const translateToHorizontal = ({ orientation, maxWidth, maxHeight }) => {
  if ([HORIZONTAL, NORTH_EAST, SOUTH_EAST].includes(orientation)) {
    return { orientation, maxWidth, maxHeight }
  } else {
    return {
      orientation: HORIZONTAL,
      maxWidth: maxHeight, // NB swap is deliberate, not a typo
      maxHeight: maxWidth, // NB swap is deliberate, not a typo
    }
  }
}

const wordTokenizer = inputString => inputString
  .replace(/<br>/g, ' <br> ')
  .split(' ')
  .map(token => token.trim())
  .filter(token => token.length)

const splitIntoLinesWithInfo = (input) => {
  if (input.text.length === 0) { return [input.text] }
  let tokens = (input.wrap === wrap.WORD)
    ? wordTokenizer(input.text)
    : input.text.split('')
  let joinCharacter = (input.wrap === wrap.WORD) ? ' ' : ''

  // TODO can i safely use Array.includes here given by current babel setup ?
  if (
    [NORTH_EAST, SOUTH_EAST].includes(input.orientation)
    && (!input.maxLines || !input.maxLines === 1)
  ) {
    throw new Error('rhtmlLabelUtils does not handle wrapping of diagonal labels yet. maxLines must be set to 1 for diagonal labels.')
  }
  return _splitIntoLines({ ...input, tokens, joinCharacter })
}

const splitIntoLines = (input) => {
  return splitIntoLinesWithInfo(input)
    .map(lineWithInfo => lineWithInfo.text)
}

const _splitIntoLines = ({
  parentContainer,
  fontSize: fontSizeStringOrNumber = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  maxWidth: untranslatedMaxWidth = null,
  maxHeight: untranslatedMaxHeight = null,
  maxLines = null,
  tokens,
  joinCharacter,
  orientation: untranslatedOrientation = HORIZONTAL,
  innerLinePadding = 1,
} = {}) => {
  const fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber)

  let currentLineTokens = []
  let linesInfo = []
  let totalHeight = 0
  const truncationString = '...'
  const numTruncationCharacters = truncationString.length
  let token = null

  const { orientation, maxWidth, maxHeight } = translateToHorizontal({
    orientation: untranslatedOrientation,
    maxWidth: untranslatedMaxWidth,
    maxHeight: untranslatedMaxHeight
  })

  const toHundredth = value => Math.round(value * 100) / 100
  const isNull = value => value === null
  const horizontalAndOnFirstLine = () => orientation === HORIZONTAL && linesInfo.length === 0
  const widthExceeded = width => !isNull(maxWidth) && toHundredth(width) > toHundredth(maxWidth)
  const heightExceeded = height => !isNull(maxHeight) && toHundredth(height) > toHundredth(maxHeight)
  const getDimensionsFromString = text => getSingleLineLabelDimensions({ parentContainer, text, fontSize, fontFamily, fontWeight, orientation })
  const getDimensionsFromArray = (tokenArray) => getDimensionsFromString(tokenArray.join(joinCharacter))
  const getDimensions = arrayOrString => (Array.isArray(arrayOrString))
    ? getDimensionsFromArray(arrayOrString)
    : getDimensionsFromString(arrayOrString)

  function truncateWith () {
    let lastLine = linesInfo[linesInfo.length - 1]
    lastLine.text = `${lastLine.text}${truncationString}`
    let tooBig = true
    while (tooBig && lastLine.text.length > 0 && lastLine.text !== truncationString) {
      const { width, height, xOffset, yOffset, transform } = getDimensions(lastLine.text)
      tooBig = widthExceeded(width)
      if (!tooBig) {
        Object.assign(lastLine, { width, height, xOffset, yOffset, transform })
        break
      }
      lastLine.text = lastLine.text.slice(0, lastLine.text.length - (numTruncationCharacters + 1)) + truncationString
    }

    linesInfo[linesInfo.length - 1] = lastLine
  }

  while (token = tokens.shift()) { // eslint-disable-line no-cond-assign
    if (token === '<br>') {
      const { width, height, xOffset, yOffset, transform } = getDimensions(currentLineTokens)
      linesInfo.push({ text: `${currentLineTokens.join(joinCharacter)}`, width, height, xOffset, yOffset, transform })
      totalHeight += (height + innerLinePadding)
      currentLineTokens = []
      continue
    }

    currentLineTokens.push(token)

    const { width, height, xOffset, yOffset, transform } = getDimensions(currentLineTokens)

    if (heightExceeded(totalHeight + height) && !horizontalAndOnFirstLine()) {
      if (linesInfo.length === 0) {
        // TODO check if the current line still fits, and if not delete characters
        linesInfo.push({ text: `${currentLineTokens.join(joinCharacter)}`, width, height, xOffset, yOffset, transform })
        truncateWith()
        currentLineTokens = []
        break
      } else {
        // TODO check if the modified last line still fits, and if not delete characters
        truncateWith()
        currentLineTokens = []
        break
      }
    }

    // this still allows height to be exceeded ...
    if ((widthExceeded(width)) && currentLineTokens.length > 1) {
      if (maxLines && linesInfo.length === maxLines - 1) {
        currentLineTokens.pop()
        linesInfo.push({ text: `${currentLineTokens.join(joinCharacter)}`, width, height, xOffset, yOffset, transform })
        truncateWith()
        currentLineTokens = []
        break
      } else {
        tokens.unshift(currentLineTokens.pop())
        linesInfo.push({ text: `${currentLineTokens.join(joinCharacter)}`, width, height, xOffset, yOffset, transform })
        totalHeight += (height + innerLinePadding)
        currentLineTokens = []
      }
    }
  }

  if (currentLineTokens.length > 0) {
    const { width, height, xOffset, yOffset, transform } = getDimensions(currentLineTokens)
    linesInfo.push({ text: `${currentLineTokens.join(joinCharacter)}`, width, height, xOffset, yOffset, transform })
  }

  if (linesInfo.length === 0) {
    const { width, height, xOffset, yOffset, transform } = getDimensions(truncationString)
    return [{ text: truncationString, width, height, xOffset, yOffset, transform }]
  }

  return linesInfo
}

module.exports = {
  splitIntoLines,
  splitIntoLinesWithInfo
}
