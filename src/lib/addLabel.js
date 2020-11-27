import _ from "lodash";

const { splitIntoLinesByCharacter, splitIntoLinesByWord } = require('./splitIntoLines')

const orientationOptions = {
  HORIZONTAL: 'HORIZONTAL',
  TOP_TO_BOTTOM: 'TOP_TO_BOTTOM',
  BOTTOM_TO_TOP: 'BOTTOM_TO_TOP',
}

const wrapOptions = {
  WORD: 'WORD',
  CHARACTER: 'CHARACTER',
}

const horizontalAlignmentOptions = {
  LEFT: 'LEFT',
  CENTER: 'CENTER',
  RIGHT: 'RIGHT',
}

const verticalAlignmentOptions = {
  TOP: 'TOP',
  CENTER: 'CENTER',
  BOTTOM: 'BOTTOM',
}

const addLabel = ({
  parentContainer,
  text,
  fontSize = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  fontColor = '#000000',
  bounds: { width, height },
  maxLines = null,
  orientation = orientationOptions.HORIZONTAL,
  wrap = wrapOptions.WORD,
  verticalAlignment = verticalAlignmentOptions.TOP,
  horizontalAlignment = verticalAlignmentOptions.CENTER,
  innerLinePadding = 1,
}) => {
  // TODO INPUT VALIDATION

  const wrapFunction = (wrap === wrapOptions.WORD)
    ? splitIntoLinesByWord
    : splitIntoLinesByCharacter

  const rotation = getRotation(orientation)

  const lines = wrapFunction({
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
    case horizontalAlignmentOptions.LEFT:
      textSelection
        .attr('transform', `translate(0, ${textYOffset})`)
        .style('text-anchor', 'start')
      break
    case horizontalAlignmentOptions.CENTER:
      textSelection
        .attr('transform', `translate(${width / 2}, ${textYOffset})`)
        .style('text-anchor', 'middle')
      break
    case horizontalAlignmentOptions.RIGHT:
      textSelection
        .attr('transform', `translate(${width}, ${textYOffset})`)
        .style('text-anchor', 'end')
      break
    default:
      throw new Error(`unknown horizontal alignment: '${horizontalAlignment}'`)
  }

  const useBoundsIfFirstRowAndFontTooLarge = (i) => (i === 0) ? Math.min(height, fontSize) : fontSize

  switch (verticalAlignment) {
    case verticalAlignmentOptions.TOP:
      _(lines).each((line, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'text-before-edge')
          .attr('x', 0)
          .attr('y', i * (fontSize + innerLinePadding))
          .text(line)
      })
      break
    case verticalAlignmentOptions.CENTER:
      _(lines).each((line, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'central')
          .attr('x', 0)
          .attr('y', useBoundsIfFirstRowAndFontTooLarge(i) / 2 + i * (fontSize + innerLinePadding))
          .text(line)
      })
      break
    case verticalAlignmentOptions.BOTTOM:
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
  options: {
    orientation: orientationOptions,
    wrap: wrapOptions,
    horizontalAlignment: horizontalAlignmentOptions,
    verticalAlignment: verticalAlignmentOptions,
  },
}

const getRotation = orientation => {
  switch (orientation) {
    case orientationOptions.HORIZONTAL:
      return 0
    case orientationOptions.BOTTOM_TO_TOP:
      return -90
    case orientationOptions.TOP_TO_BOTTOM:
      return 90
    default:
      throw new Error(`unknown orientation: '${orientation}'`)
  }
}
