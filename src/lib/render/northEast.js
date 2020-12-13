const enums = require('../enums')

// TODO duplicated toRadians fn
const toRadians = degrees => degrees * (Math.PI / 180)

module.exports = ({
  parentContainer,
  linesWithInfo,
  fontSize = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  fontColor = '#000000',
  bounds,
  horizontalAlignment = enums.horizontalAlignment.LEFT,
  verticalAlignment = enums.verticalAlignment.BOTTOM,
}) => {
  const { text, xOffset, yOffset, width: labelWidth } = linesWithInfo[0]

  if ([enums.verticalAlignment.CENTER, enums.verticalAlignment.TOP].includes(verticalAlignment)) {
    console.warn(`NORTH_EAST label cannot have verticalAlignment = CENTER or TOP`)
  }
  if ([enums.horizontalAlignment.CENTER, enums.horizontalAlignment.RIGHT].includes(horizontalAlignment)) {
    console.warn(`NORTH_EAST label cannot have horizontalAlignment = CENTER or RIGHT`)
  }

  let xTransform = Math.sin(toRadians(45)) * fontSize / 2
  let yTransform = bounds.height

  const textSelection = parentContainer.append('text')
    .attr('transform', `translate(${xTransform}, ${yTransform}),rotate(-45)`)
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', 0)
    .style('text-anchor', 'start')
    .style('font-family', fontFamily)
    .style('font-weight', fontWeight)
    .style('font-size', `${fontSize}px`)
    .style('fill', fontColor)
    .text(text)


  return textSelection
}
