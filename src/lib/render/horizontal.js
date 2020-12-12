const enums = require('../enums')

module.exports = ({
  parentContainer,
  linesWithInfo,
  fontSize = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  fontColor = '#000000',
  bounds: { width, height } = { width: 100, height: 100 },
  verticalAlignment = enums.verticalAlignment.TOP,
  horizontalAlignment = enums.horizontalAlignment.CENTER,
  innerLinePadding = 1,
}) => {
  // TODO do not use fontSize as a proxy for line height
  const extraSpace = height - (fontSize * linesWithInfo.length + innerLinePadding * (linesWithInfo.length - 1))

  const textYOffset = (verticalAlignment === enums.verticalAlignment.CENTER && extraSpace > 0)
    ? extraSpace / 2
    : 0

  const textSelection = parentContainer.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', 0)
    .style('font-family', fontFamily)
    .style('font-size', `${fontSize}px`)
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

  // TODO I didn't test or understand this code, just ported it over
  const useBoundsIfFirstRowAndFontTooLarge = (i) => (i === 0) ? Math.min(height, fontSize) : fontSize

  switch (verticalAlignment) {
    case enums.verticalAlignment.TOP:
      linesWithInfo.forEach(({ text }, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'text-before-edge')
          .attr('x', 0)
          .attr('y', i * (fontSize + innerLinePadding))
          .text(text)
      })
      break
    case enums.verticalAlignment.CENTER:
      linesWithInfo.forEach(({ text }, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'central')
          .attr('x', 0)
          .attr('y', useBoundsIfFirstRowAndFontTooLarge(i) / 2 + i * (fontSize + innerLinePadding))
          .text(text)
      })
      break
    case enums.verticalAlignment.BOTTOM:
      linesWithInfo.reverse().forEach(({ text }, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'text-after-edge')
          .attr('x', 0)
          .attr('y', height - i * (fontSize + innerLinePadding))
          .text(text)
      })
      break
    default:
      throw new Error(`unknown vertical alignment: '${verticalAlignment}'`)
  }

  return textSelection
}
