const { getSingleLineLabelDimensions } = require('./getSingleLineLabelDimensions')
const { orientation: { HORIZONTAL }} = require('./enums')

const isNull = value => value === null

const wordTokenizer = inputString => {
  const inputString2 = inputString.replace(/<br>/g, ' <br> ')
  return inputString2.split(' ').map(token => token.trim()).filter(token => token.length)
}

function splitIntoLinesByWord ({ parentContainer, text, fontSize = 12, fontFamily = 'sans-serif', fontWeight = 'normal', maxWidth, maxHeight, maxLines = null, orientation = HORIZONTAL } = {}) {
  let tokens = wordTokenizer(text)
  return _splitIntoLines({
    parentContainer,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    maxWidth,
    maxHeight,
    maxLines,
    tokens,
    joinCharacter: ' ',
    orientation,
  })
}

function splitIntoLinesByCharacter ({ parentContainer, text, fontSize = 12, fontFamily = 'sans-serif', fontWeight = 'normal', maxWidth, maxHeight, maxLines = null, orientation = HORIZONTAL } = {}) {
  let tokens = text.split('')
  return _splitIntoLines({
    parentContainer,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    maxWidth,
    maxHeight,
    maxLines,
    tokens,
    joinCharacter: '',
    orientation,
  })
}

function _splitIntoLines ({ parentContainer, text, fontSize = 12, fontFamily = 'sans-serif', fontWeight = 'normal', maxWidth = null, maxHeight = null, maxLines = null, tokens, joinCharacter, orientation } = {}) {
  if (text.length === 0) { return [text] }
  let currentLine = []
  let lines = []
  let totalHeight = 0
  const truncationString = '...'
  let token = null

  const horizontalAndOnFirstLine = () => orientation === HORIZONTAL && lines.length === 0
  const widthExceeded = (width) => !isNull(maxWidth) && width > maxWidth
  const heightExceeded = (height) => !isNull(maxHeight) && height > maxHeight
  const getDimensionsFromString = (string) => getSingleLineLabelDimensions({
    parentContainer,
    text: string,
    fontSize,
    fontFamily,
    fontWeight,
    orientation
  })
  const getDimensionsFromArray = (tokenArray) => getDimensionsFromString(tokenArray.join(joinCharacter))
  const getDimensions = (arrayOrString) => (Array.isArray(arrayOrString))
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
      totalHeight += height
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
        totalHeight += height
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

module.exports = {
  splitIntoLinesByWord,
  splitIntoLinesByCharacter
}
