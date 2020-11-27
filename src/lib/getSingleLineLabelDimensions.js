const { orientation: { HORIZONTAL } } = require('./enums')
const orientationToRotation = require('../utils/orientationToRotation')

let uniqueId = 0
function getUniqueId () { return uniqueId++ }

const DEBUG = false
function getSingleLineLabelDimensions ({ parentContainer, text, fontSize: fontSizeStringOrNumber = '16px', fontFamily = 'Times', fontWeight = 'normal', orientation = HORIZONTAL }) {
  const uniqueId = `tempLabel-${getUniqueId()}`

  if (!`${fontSizeStringOrNumber}`.match(/^[\d]+(px)?$/)) { throw new Error(`Invalid fontSize '${fontSizeStringOrNumber}'. Must be numeric with optional trailing 'px'. (em|rem) not supported`)}
  const fontSize = (`${fontSizeStringOrNumber}`.indexOf('px') === -1) ? `${fontSizeStringOrNumber}px` : `${fontSizeStringOrNumber}`

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
    .style('font-size', fontSize)
    .style('font-family', fontFamily)
    .style('font-weight', fontWeight)
    .style('dominant-baseline', 'text-before-edge')
    .text(text)

  const { x, y, width, height } = textElement.node().getBoundingClientRect()

  if (DEBUG) {
    const computedWidth = textElement.node().getComputedTextLength()

    if (DEBUG && Math.abs(computedWidth - width) > 1) {
      console.warn(`getSingleLineLabelDimensions('${text}'): discrepancy between getBbox().width and getComputedTextLength (bb:${width}, comp:${computedWidth}`)
    }

    if (DEBUG && x !== 0) {
      console.warn(`getSingleLineLabelDimensions('${text}'): got non zero x offset: ${x}`)
    }

    if (DEBUG && y !== 0) {
      console.warn(`getSingleLineLabelDimensions('${text}'): got non zero y offset: ${y}`)
    }
  }

  parentContainer.select(`#${uniqueId}`).remove()
  return { width, height }
}

module.exports = { getSingleLineLabelDimensions }
