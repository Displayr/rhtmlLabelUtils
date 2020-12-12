const { orientation: { HORIZONTAL, TOP_TO_BOTTOM, BOTTOM_TO_TOP, NORTH_EAST, SOUTH_EAST } } = require('./enums')
const orientationToRotation = require('../utils/orientationToRotation')
const validateFontSizeAndConvertNumeric = require('../utils/validateFontSizeAndConvertNumeric')
let uniqueId = 0
function getUniqueId () { return uniqueId++ }

function getSingleLineLabelDimensions ({
  parentContainer,
  text,
  fontSize: fontSizeStringOrNumber = '12',
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  orientation = HORIZONTAL
}) {
  const uniqueId = `tempLabel-${getUniqueId()}`
  const fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber)

  const rotation = orientationToRotation(orientation)

  const container = parentContainer.append('g')
    .attr('class', 'tempLabel')
    .attr('id', uniqueId)

  const textElement = container.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', 0)
    .attr('transform', `rotate(${rotation})`)

  textElement.append('tspan')
    .attr('x', 0)
    .attr('y', 0)
    .style('font-size', `${fontSize}px`)
    .style('font-family', fontFamily)
    .style('font-weight', fontWeight)
    .style('dominant-baseline', 'text-before-edge')
    .text(text)

  const { width, height } = textElement.node().getBoundingClientRect()
  let { xOffset, yOffset } = getOffsets({ orientation ,width, height, fontSize })
  let transform = getTransform({ rotation, xOffset, yOffset })

  parentContainer.select(`#${uniqueId}`).remove()
  return { width, height, xOffset, yOffset, transform }
}

const toRadians = degrees => degrees * (Math.PI / 180)

const getOffsets = ({ orientation, width, height, fontSize }) => {
  switch(orientation) {
    case HORIZONTAL: return { xOffset: 0, yOffset: 0 }
    case TOP_TO_BOTTOM: return { xOffset: width, yOffset: 0 }
    case BOTTOM_TO_TOP: return { xOffset: 0, yOffset: height }
    // TODO Dont assume font size is height in SOUTH_EAST AND NORTH_EAST
    case NORTH_EAST: return { xOffset: 0, yOffset: height - Math.sin(toRadians(45)) * fontSize}
    case SOUTH_EAST: return { xOffset: Math.sin(toRadians(45)) * fontSize, yOffset: 0 }
    default: throw new Error(`Invalid orientation '${orientation}'`)
  }
}

const getTransform = ({ rotation, xOffset, yOffset }) => (rotation === 0)
  ? ''
  : `translate(${xOffset},${yOffset}),rotate(${rotation})`

module.exports = getSingleLineLabelDimensions
