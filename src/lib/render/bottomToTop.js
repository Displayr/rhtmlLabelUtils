const enums = require('../enums')

// TODO : respect vertical and horizontal alignment

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

  const consumedWidth = fontSize * lines.length + innerLinePadding * (lines.length - 1)
  let initialXOffset = 0
  if (horizontalAlignment === enums.horizontalAlignment.CENTER) { initialXOffset = (width - consumedWidth) / 2 }
  if (horizontalAlignment === enums.horizontalAlignment.RIGHT) { initialXOffset = width - consumedWidth }

  lines.forEach((line, i) => {
    const container = parentContainer.append('g')
      .attr('transform', `translate(${initialXOffset + i * (fontSize + innerLinePadding)},0)`)

    const textElement = container.append('text')
      .attr('class', `test-label`)
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', 0)
      .attr('dominant-baseline', 'text-before-edge')
      .style('fill', fontColor)

    textElement.append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', fontSize)
      .style('font-family', fontFamily)
      .style('font-weight', fontWeight)
      .style('dominant-baseline', 'text-before-edge')
      .text(line)

    switch (verticalAlignment) {
      case enums.verticalAlignment.TOP:
        textElement
        .attr('transform', `translate(0,0),rotate(-90)`)
        .style('text-anchor', 'end')
        break
      case enums.verticalAlignment.CENTER:
        textElement
        .attr('transform', `translate(0,${height / 2}),rotate(-90)`)
        .style('text-anchor', 'middle')
        break
      case enums.verticalAlignment.BOTTOM:
        textElement
        .attr('transform', `translate(0,${height}),rotate(-90)`)
        .style('text-anchor', 'start')
        break
      default:
        throw new Error(`unknown vertical alignment: '${verticalAlignment}'`)
    }
  })

  return parentContainer.select('text')
}
