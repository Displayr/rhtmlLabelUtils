// In an external project you would require or import 'rhtmlLabelUtils'
// const { addLabel, enums, getDimensions, getSingleLineLabelDimensions, splitIntoLines } = require('rhtmlLabelUtils')

// In this internal usage example we require from source
const { addLabel, enums, getDimensions, getSingleLineLabelDimensions, splitIntoLines } = require('../../src')

document.addEventListener('DOMContentLoaded', () => {
  const parentContainer = d3.select('svg')

  addLabel({
    parentContainer: parentContainer.append('g').attr('transform', 'translate(100,100)'),
    text: 'test label with a bit of wrapping',
    bounds: { width: 100, height: 100 },
  })

  addLabel({
    parentContainer: parentContainer.append('g').attr('transform', 'translate(220,100)'),
    text: 'test label with a bit of wrapping',
    orientation: enums.orientation.TOP_TO_BOTTOM,
    bounds: { width: 100, height: 100 },
  })

  addLabel({
    parentContainer: parentContainer.append('g').attr('transform', 'translate(340,100)'),
    text: 'test label with a bit of wrapping',
    orientation: enums.orientation.BOTTOM_TO_TOP,
    bounds: { width: 100, height: 100 },
  })

  const lines = splitIntoLines({
    parentContainer,
    wrap: enums.wrap.WORD,
    text: 'test label with a bit of wrapping',
    maxWidth: 100,
    maxHeight: 100,
  })
  console.log(lines)

  const dimensions = getDimensions({
    parentContainer,
    text: 'test text',
    maxWidth: 100,
    maxHeight: 100,
    maxLines: 2,
    fontSize: 12,
    fontFamily: 'arial',
    fontWeight: 'normal',
    orientation: enums.orientation.HORIZONTAL,
  })
  console.log(dimensions)

  addLabel({
    parentContainer: parentContainer.append('g').attr('transform', 'translate(300,300)'),
    text: `enum reference <br> ${JSON.stringify(enums, {}, 2).replace(/(?:\r\n|\r|\n)/g, ' <br> ')}`,
    bounds: { width: 500, height: 300 },
    horizontalAlignment: enums.horizontalAlignment.LEFT
  })

}, false)
