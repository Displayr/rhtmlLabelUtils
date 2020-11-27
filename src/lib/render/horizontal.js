const enums = require('../enums')

module.exports = ({
  parentContainer,
  lines,
  fontSize = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  fontColor = '#000000',
  bounds: { width, height } = { width: 100, height: 100 },
  verticalAlignment = enums.verticalAlignment.TOP,
  horizontalAlignment = enums.horizontalAlignment.CENTER,
  innerLinePadding = 1,
}) => {
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
      lines.forEach((line, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'text-before-edge')
          .attr('x', 0)
          .attr('y', i * (fontSize + innerLinePadding))
          .text(line)
      })
      break
    case enums.verticalAlignment.CENTER:
      lines.forEach((line, i) => {
        textSelection.append('tspan')
          .style('dominant-baseline', 'central')
          .attr('x', 0)
          .attr('y', useBoundsIfFirstRowAndFontTooLarge(i) / 2 + i * (fontSize + innerLinePadding))
          .text(line)
      })
      break
    case enums.verticalAlignment.BOTTOM:
      lines.reverse().each((line, i) => {
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
