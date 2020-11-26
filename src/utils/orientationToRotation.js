const { orientation: { HORIZONTAL, BOTTOM_TO_TOP, TOP_TO_BOTTOM} } = require('../lib/enums')

module.exports = orientation => {
  switch (orientation) {
    case HORIZONTAL: return 0
    case BOTTOM_TO_TOP: return -90
    case TOP_TO_BOTTOM: return 90
    default: throw new Error(`unknown orientation: '${orientation}'`)
  }
}
