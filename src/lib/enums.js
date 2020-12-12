const orientationOptions = {
  HORIZONTAL: 'HORIZONTAL',
  TOP_TO_BOTTOM: 'TOP_TO_BOTTOM',
  BOTTOM_TO_TOP: 'BOTTOM_TO_TOP',
  NORTH_EAST: 'NORTH_EAST',
  SOUTH_EAST: 'SOUTH_EAST',
}

const wrapOptions = {
  WORD: 'WORD',
  CHARACTER: 'CHARACTER',
}

const horizontalAlignmentOptions = {
  LEFT: 'LEFT',
  CENTER: 'CENTER',
  RIGHT: 'RIGHT',
}

const verticalAlignmentOptions = {
  TOP: 'TOP',
  CENTER: 'CENTER',
  BOTTOM: 'BOTTOM',
}

module.exports = {
  orientation: orientationOptions,
  wrap: wrapOptions,
  horizontalAlignment: horizontalAlignmentOptions,
  verticalAlignment: verticalAlignmentOptions,
}
