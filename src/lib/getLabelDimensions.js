let uniqueId = 0
function getUniqueId () { return uniqueId++ }

const DEBUG_OUTPUT_DISCREPANCY = false
const DEBUG_OUTPUT_NON_ZERO_OFFSETS = false

// NB parentContainer must be a d3 selection
function getHorizontalLabelDimensions ({ parentContainer, text, fontSize, fontFamily, fontWeight }) {
  return getLabelDimensions({ parentContainer, text, fontSize, fontFamily, fontWeight, rotation: 0 })
}

function getVerticalLabelDimensions ({ parentContainer, text, fontSize, fontFamily, fontWeight }) {
  return getLabelDimensions({ parentContainer, text, fontSize, fontFamily, fontWeight, rotation: 90 })
}

function getLabelDimensions ({ parentContainer, text, fontSize: fontSizeStringOrNumber = '16px', fontFamily = 'Times', fontWeight = 'normal', rotation = 0 }) {
  const uniqueId = `tempLabel-${getUniqueId()}`

  if (!`${fontSizeStringOrNumber}`.match(/^[\d]+(px)?$/)) { throw new Error(`Invalid fontSize '${fontSizeStringOrNumber}'. Must be numeric with optional trailing 'px'. (em|rem) not supported`)}
  const fontSize = (`${fontSizeStringOrNumber}`.indexOf('px') === -1) ? `${fontSizeStringOrNumber}px` : `${fontSizeStringOrNumber}`

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

  const { x, y, width, height } = textElement.node().getBBox()

  const computedWidth = textElement.node().getComputedTextLength()
  parentContainer.select(`#${uniqueId}`).remove()

  if (DEBUG_OUTPUT_DISCREPANCY && Math.abs(computedWidth - width) > 1) {
    console.warn(`getHorizontalLabelDimensions('${text}'): discrepancy between getBbox().width and getComputedTextLength (bb:${width}, comp:${computedWidth}`)
  }

  if (DEBUG_OUTPUT_NON_ZERO_OFFSETS && x !== 0) {
    console.warn(`getHorizontalLabelDimensions('${text}'): got non zero x offset: ${x}`)
  }

  if (DEBUG_OUTPUT_NON_ZERO_OFFSETS && y !== 0) {
    console.warn(`getHorizontalLabelDimensions('${text}'): got non zero y offset: ${y}`)
  }

  return { width, height, computedWidth }
}

module.exports = { getHorizontalLabelDimensions, getVerticalLabelDimensions }
