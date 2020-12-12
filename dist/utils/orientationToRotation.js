"use strict";

var _require = require('../lib/enums'),
    _require$orientation = _require.orientation,
    HORIZONTAL = _require$orientation.HORIZONTAL,
    BOTTOM_TO_TOP = _require$orientation.BOTTOM_TO_TOP,
    TOP_TO_BOTTOM = _require$orientation.TOP_TO_BOTTOM;

module.exports = function (orientation) {
  switch (orientation) {
    case HORIZONTAL:
      return 0;

    case BOTTOM_TO_TOP:
      return -90;

    case TOP_TO_BOTTOM:
      return 90;

    default:
      throw new Error("unknown orientation: '".concat(orientation, "'"));
  }
};