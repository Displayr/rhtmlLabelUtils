const { orientation: {
  HORIZONTAL,
  BOTTOM_TO_TOP,
  TOP_TO_BOTTOM,
  NORTH_EAST,
  SOUTH_EAST,
} } = require('../lib/enums')

module.exports = orientation => {
  switch (orientation) {
    case HORIZONTAL: return 0
    case BOTTOM_TO_TOP: return -90
    case TOP_TO_BOTTOM: return 90
    case NORTH_EAST: return -45
    case SOUTH_EAST: return 45
    default: throw new Error(`Invalid orientation: '${orientation}'`)
  }
}
