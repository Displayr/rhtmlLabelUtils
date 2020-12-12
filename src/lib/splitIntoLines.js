const getSingleLineLabelDimensions = require('./getSingleLineLabelDimensions')
const { orientation: { HORIZONTAL }, wrap } = require('./enums')
const validateFontSizeAndConvertNumeric = require('../utils/validateFontSizeAndConvertNumeric')

// TODO the _splitIntoLines needs a cleanup, but first it needs some test coverage
// I have not really touched this file (yet) since extracting it into labelUtils repo


const wordTokenizer = inputString => inputString
  .replace(/<br>/g, ' <br> ')
  .split(' ')
  .map(token => token.trim())
  .filter(token => token.length)

const splitIntoLines = ({ text = '', wrap: wrapChoice, ...rest } = {}) => {
  if (text.length === 0) { return [text] }
  let tokens = (wrapChoice === wrap.WORD)
    ? wordTokenizer(text)
    : text.split('')
  let joinCharacter = (wrapChoice === wrap.WORD) ? ' ' : ''
  return _splitIntoLines({ tokens, joinCharacter, ...rest})
}

// NB not sure if this will work. Depends if font rendering is same size wise horizontal vs vertical
const translateToHorizontal = ({ orientation, maxWidth, maxHeight }) => {
  if (orientation === HORIZONTAL) {
    return { orientation, maxWidth, maxHeight }
  } else {
    return {
      orientation: HORIZONTAL,
      maxWidth: maxHeight, // NB swap is deliberate, not a typo
      maxHeight: maxWidth, // NB swap is deliberate, not a typo
    }
  }
}

function _splitIntoLines ({
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
} = {}) {
  const fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber)

  let currentLine = []
  let lines = []
  let totalHeight = 0
  const truncationString = '...'
  let token = null

  const { orientation, maxWidth, maxHeight } = translateToHorizontal({
    orientation: untranslatedOrientation,
    maxWidth: untranslatedMaxWidth,
    maxHeight: untranslatedMaxHeight
  })

  const toHundredth = value => Math.round(value * 100) / 100
  const isNull = value => value === null
  const horizontalAndOnFirstLine = () => orientation === HORIZONTAL && lines.length === 0
  const widthExceeded = width => !isNull(maxWidth) && toHundredth(width) > toHundredth(maxWidth)
  const heightExceeded = height => !isNull(maxHeight) && toHundredth(height) > toHundredth(maxHeight)
  const getDimensionsFromString = text => getSingleLineLabelDimensions({ parentContainer, text, fontSize, fontFamily, fontWeight, orientation })
  const getDimensionsFromArray = (tokenArray) => getDimensionsFromString(tokenArray.join(joinCharacter))
  const getDimensions = arrayOrString => (Array.isArray(arrayOrString))
    ? getDimensionsFromArray(arrayOrString)
    : getDimensionsFromString(arrayOrString)

  function truncateWith () {
    let lastLine = lines[lines.length - 1]
    const numTruncationCharacters = truncationString.length
    lastLine = `${lastLine}${truncationString}`
    let tooBig = true
    while (tooBig && lastLine.length > 0 && lastLine !== truncationString) {
      const { width } = getDimensions(lastLine)
      tooBig = widthExceeded(width)
      if (!tooBig) { break }
      lastLine = lastLine.slice(0, lastLine.length - (numTruncationCharacters + 1)) + truncationString
    }

    lines[lines.length - 1] = lastLine
  }

  while (token = tokens.shift()) { // eslint-disable-line no-cond-assign
    if (token === '<br>') {
      const { height } = getDimensions(currentLine)
      lines.push(`${currentLine.join(joinCharacter)}`)
      totalHeight += (height + innerLinePadding)
      currentLine = []
      continue
    }

    currentLine.push(token)

    const { width, height } = getDimensions(currentLine)

    if (heightExceeded(totalHeight + height) && !horizontalAndOnFirstLine()) {
      if (lines.length === 0) {
        // TODO check if the current line still fits, and if not delete characters
        lines.push(`${currentLine.join(joinCharacter)}`)
        truncateWith()
        currentLine = []
        break
      } else {
        // TODO check if the modified last line still fits, and if not delete characters
        truncateWith()
        currentLine = []
        break
      }
    }

    // this still allows height to be exceeded ...
    if ((widthExceeded(width)) && currentLine.length > 1) {
      if (maxLines && lines.length === maxLines - 1) {
        currentLine.pop()
        lines.push(`${currentLine.join(joinCharacter)}`)
        truncateWith()
        currentLine = []
        break
      } else {
        tokens.unshift(currentLine.pop())
        lines.push(`${currentLine.join(joinCharacter)}`)
        totalHeight += (height + innerLinePadding)
        currentLine = []
      }
    }
  }

  if (currentLine.length > 0) {
    lines.push(`${currentLine.join(joinCharacter)}`)
  }

  return (lines.length === 0)
    ? ['...']
    : lines
}

module.exports = splitIntoLines
