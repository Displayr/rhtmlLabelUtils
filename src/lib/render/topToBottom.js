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
  lines.reverse().forEach((line, i) => {
    const container = parentContainer.append('g')
      .attr('transform', `translate(${i * (fontSize + innerLinePadding)},0)`)

    const textElement = container.append('text')
      .attr('class', `test-label`)
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', 0)
      .attr('dominant-baseline', 'text-after-edge')
      .attr('transform', `translate(0,0),rotate(90)`)
      .style('fill', fontColor)

    textElement.append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', fontSize)
      .style('font-family', fontFamily)
      .style('font-weight', fontWeight)
      .style('dominant-baseline', 'text-after-edge')
      .text(line)
  })
}
