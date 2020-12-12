"use strict";

var _require = require('../lib/enums'),
    _require$orientation = _require.orientation,
    HORIZONTAL = _require$orientation.HORIZONTAL,
    BOTTOM_TO_TOP = _require$orientation.BOTTOM_TO_TOP,
    TOP_TO_BOTTOM = _require$orientation.TOP_TO_BOTTOM,
    NORTH_EAST = _require$orientation.NORTH_EAST,
    SOUTH_EAST = _require$orientation.SOUTH_EAST;

module.exports = function (orientation) {
  switch (orientation) {
    case HORIZONTAL:
      return 0;

    case BOTTOM_TO_TOP:
      return -90;

    case TOP_TO_BOTTOM:
      return 90;

    case NORTH_EAST:
      return -45;

    case SOUTH_EAST:
      return 45;

    default:
      throw new Error("Invalid orientation: '".concat(orientation, "'"));
  }
};