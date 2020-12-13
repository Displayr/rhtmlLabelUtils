"use strict";

var _require = require('./enums'),
    _require$orientation = _require.orientation,
    HORIZONTAL = _require$orientation.HORIZONTAL,
    TOP_TO_BOTTOM = _require$orientation.TOP_TO_BOTTOM,
    BOTTOM_TO_TOP = _require$orientation.BOTTOM_TO_TOP,
    NORTH_EAST = _require$orientation.NORTH_EAST,
    SOUTH_EAST = _require$orientation.SOUTH_EAST;

var orientationToRotation = require('../utils/orientationToRotation');

var validateFontSizeAndConvertNumeric = require('../utils/validateFontSizeAndConvertNumeric');

var uniqueId = 0;

function getUniqueId() {
  return uniqueId++;
}

function getSingleLineLabelDimensions(_ref) {
  var parentContainer = _ref.parentContainer,
      text = _ref.text,
      _ref$fontSize = _ref.fontSize,
      fontSizeStringOrNumber = _ref$fontSize === void 0 ? '12' : _ref$fontSize,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === void 0 ? 'sans-serif' : _ref$fontFamily,
      _ref$fontWeight = _ref.fontWeight,
      fontWeight = _ref$fontWeight === void 0 ? 'normal' : _ref$fontWeight,
      _ref$orientation = _ref.orientation,
      orientation = _ref$orientation === void 0 ? HORIZONTAL : _ref$orientation;
  var uniqueId = "tempLabel-".concat(getUniqueId());
  var fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber);
  var rotation = orientationToRotation(orientation);
  var container = parentContainer.append('g').attr('class', 'tempLabel').attr('id', uniqueId);
  var textElement = container.append('text').attr('x', 0).attr('y', 0).attr('dy', 0).attr('transform', "rotate(".concat(rotation, ")"));
  textElement.append('tspan').attr('x', 0).attr('y', 0).style('font-size', "".concat(fontSize, "px")).style('font-family', fontFamily).style('font-weight', fontWeight).style('dominant-baseline', 'text-before-edge').text(text);

  var _textElement$node$get = textElement.node().getBoundingClientRect(),
      width = _textElement$node$get.width,
      height = _textElement$node$get.height;

  var _getOffsets = getOffsets({
    orientation: orientation,
    width: width,
    height: height,
    fontSize: fontSize
  }),
      xOffset = _getOffsets.xOffset,
      yOffset = _getOffsets.yOffset;

  var transform = getTransform({
    rotation: rotation,
    xOffset: xOffset,
    yOffset: yOffset
  });
  parentContainer.select("#".concat(uniqueId)).remove();
  return {
    width: width,
    height: height,
    xOffset: xOffset,
    yOffset: yOffset,
    transform: transform
  };
}

var toRadians = function toRadians(degrees) {
  return degrees * (Math.PI / 180);
};

var getOffsets = function getOffsets(_ref2) {
  var orientation = _ref2.orientation,
      width = _ref2.width,
      height = _ref2.height,
      fontSize = _ref2.fontSize;

  switch (orientation) {
    case HORIZONTAL:
      return {
        xOffset: 0,
        yOffset: 0
      };

    case TOP_TO_BOTTOM:
      return {
        xOffset: width,
        yOffset: 0
      };

    case BOTTOM_TO_TOP:
      return {
        xOffset: 0,
        yOffset: height
      };
    // TODO Dont assume font size is height in SOUTH_EAST AND NORTH_EAST

    case NORTH_EAST:
      return {
        xOffset: 0,
        yOffset: height - Math.sin(toRadians(45)) * fontSize
      };

    case SOUTH_EAST:
      return {
        xOffset: Math.sin(toRadians(45)) * fontSize,
        yOffset: 0
      };

    default:
      throw new Error("Invalid orientation '".concat(orientation, "'"));
  }
};

var getTransform = function getTransform(_ref3) {
  var rotation = _ref3.rotation,
      xOffset = _ref3.xOffset,
      yOffset = _ref3.yOffset;
  return rotation === 0 ? '' : "translate(".concat(xOffset, ",").concat(yOffset, "),rotate(").concat(rotation, ")");
};

module.exports = getSingleLineLabelDimensions;