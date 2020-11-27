import _ from "lodash";

const { splitIntoLinesByCharacter, splitIntoLinesByWord } = require('./splitIntoLines')
const enums = require('./enums')

const addLabel = ({
  parentContainer,
  text = 'test label',
  fontSize = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  fontColor = '#000000',
  bounds: { width, height } = { width: 100, height: 100 },
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

  const rotation = getRotation(orientation)

  const lines = wrapFunction({
    parentContainer,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    maxWidth: width,
    maxHeight: height,
    maxLines,
    rotation,
  })

  const extraSpace = height -
    (fontSize * lines.length + innerLinePadding * (lines.length - 1))

  const textYOffset = (verticalAlignment === 'center' && extraSpace > 0)
    ? extraSpace / 2
    : 0

  const textSelection = parentContainer.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', 0)
    .style('font-family', fontFamily)
    .style('font-size', fontSize)
    .style('font-weight', fontWeight)
    .style('fill', fontColor)

  switch (horizontalAlignment) {
    case enums.horizontalAlignment.LEFT:
      textSelection
        .attr('transform', `translate(0, ${textYOffset})`)
        .style('text-anchor', 'start')
      break
    case enums.horizontalAlignment.CENTER:
      textSelection
        .attr('transform', `translate(${width / 2}, ${textYOffset})`)
        .style('text-anchor', 'middle')
      break
    case enums.horizontalAlignment.RIGHT:
      textSelection
        .attr('transform', `translate(${width}, ${textYOffset})`)
        .style('text-anchor', 'end')
      break
    default:
      throw new Error(`unknown horizontal alignment: '${horizontalAlignment}'`)
  }

  const useBoundsIfFirstRowAndFontTooLarge = (i) => (i === 0) ? Math.min(height, fontSize) : fontSize

  switch (verticalAlignment) {
    case enums.verticalAlignment.TOP:
      _(lines).each((line, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'text-before-edge')
          .attr('x', 0)
          .attr('y', i * (fontSize + innerLinePadding))
          .text(line)
      })
      break
    case enums.verticalAlignment.CENTER:
      _(lines).each((line, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'central')
          .attr('x', 0)
          .attr('y', useBoundsIfFirstRowAndFontTooLarge(i) / 2 + i * (fontSize + innerLinePadding))
          .text(line)
      })
      break
    case enums.verticalAlignment.BOTTOM:
      _(lines).reverse().each((line, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'text-after-edge')
          .attr('x', 0)
          .attr('y', height - i * (fontSize + innerLinePadding))
          .text(line)
      })
      break
    default:
      throw new Error(`unknown vertical alignment: '${verticalAlignment}'`)
  }
}

module.exports = {
  addLabel,
}

const getRotation = orientation => {
  switch (orientation) {
    case enums.orientation.HORIZONTAL:
      return 0
    case enums.orientation.BOTTOM_TO_TOP:
      return -90
    case enums.orientation.TOP_TO_BOTTOM:
      return 90
    default:
      throw new Error(`unknown orientation: '${orientation}'`)
  }
}
