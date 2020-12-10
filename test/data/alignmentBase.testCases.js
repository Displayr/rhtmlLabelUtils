const _ = require('lodash')
const enums = require('../../src/lib/enums')
const {
  horizontalAlignment: { LEFT, CENTER: H_CENTER, RIGHT },
  verticalAlignment: { TOP, CENTER: V_CENTER, BOTTOM },
} = enums

const bounds = { width: 100, height: 100 }
module.exports = _([LEFT, H_CENTER, RIGHT])
  .map((horizontalAlignment, hIndex) => {
    return [TOP, V_CENTER, BOTTOM].map((verticalAlignment, vIndex) => ({
      text: '1 22 333 4444 55555 6666666 55555 4444 333 22 1',
      horizontalAlignment,
      offset: {x: hIndex * (bounds.width + 20), y: vIndex * (bounds.height + 20)},
      verticalAlignment,
      bounds,
    }))
  })
  .flatten()
  .value()

