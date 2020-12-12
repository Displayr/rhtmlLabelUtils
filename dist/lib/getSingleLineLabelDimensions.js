"use strict";

var _require = require('./enums'),
    HORIZONTAL = _require.orientation.HORIZONTAL;

var orientationToRotation = require('../utils/orientationToRotation');

var validateFontSizeAndConvertNumeric = require('../utils/validateFontSizeAndConvertNumeric');

var uniqueId = 0;

function getUniqueId() {
  return uniqueId++;
}

var DEBUG = false;

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
      x = _textElement$node$get.x,
      y = _textElement$node$get.y,
      width = _textElement$node$get.width,
      height = _textElement$node$get.height;

  if (DEBUG) {
    var computedWidth = textElement.node().getComputedTextLength();

    if (DEBUG && Math.abs(computedWidth - width) > 1) {
      console.warn("getSingleLineLabelDimensions('".concat(text, "'): discrepancy between getBbox().width and getComputedTextLength (bb:").concat(width, ", comp:").concat(computedWidth));
    }

    if (DEBUG && x !== 0) {
      console.warn("getSingleLineLabelDimensions('".concat(text, "'): got non zero x offset: ").concat(x));
    }

    if (DEBUG && y !== 0) {
      console.warn("getSingleLineLabelDimensions('".concat(text, "'): got non zero y offset: ").concat(y));
    }
  }

  parentContainer.select("#".concat(uniqueId)).remove();
  return {
    width: width,
    height: height
  };
}

module.exports = getSingleLineLabelDimensions;