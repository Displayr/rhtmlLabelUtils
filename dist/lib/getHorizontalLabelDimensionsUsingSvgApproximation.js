"use strict";

var uniqueId = 0;

function getUniqueId() {
  return uniqueId++;
}

var DEBUG_OUTPUT_DISCREPANCY = false;
var DEBUG_OUTPUT_NON_ZERO_OFFSETS = false; // NB parentContainer must be a d3 selection

function getHorizontalLabelDimensionsUsingSvgApproximation(_ref) {
  var parentContainer = _ref.parentContainer,
      text = _ref.text,
      _ref$fontSize = _ref.fontSize,
      fontSizeStringOrNumber = _ref$fontSize === void 0 ? '16px' : _ref$fontSize,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === void 0 ? 'Times' : _ref$fontFamily,
      _ref$fontWeight = _ref.fontWeight,
      fontWeight = _ref$fontWeight === void 0 ? 'normal' : _ref$fontWeight,
      _ref$rotation = _ref.rotation,
      rotation = _ref$rotation === void 0 ? 0 : _ref$rotation;
  var uniqueId = "tempLabel-".concat(getUniqueId());

  if (!"".concat(fontSizeStringOrNumber).match(/^[\d]+(px)?$/)) {
    throw new Error("Invalid fontSize '".concat(fontSizeStringOrNumber, "'. Must be numeric with optional trailing 'px'. (em|rem) not supported"));
  }

  var fontSize = "".concat(fontSizeStringOrNumber).indexOf('px') === -1 ? "".concat(fontSizeStringOrNumber, "px") : "".concat(fontSizeStringOrNumber);
  var container = parentContainer.append('g').attr('class', 'tempLabel').attr('id', uniqueId);
  var textElement = container.append('text').attr('x', 0).attr('y', 0).attr('dy', 0).attr('transform', "rotate(".concat(rotation, ")"));
  textElement.append('tspan').attr('x', 0).attr('y', 0).style('font-size', fontSize).style('font-family', fontFamily).style('font-weight', fontWeight).style('dominant-baseline', 'text-before-edge').text(text);

  var _textElement$node$get = textElement.node().getBBox(),
      x = _textElement$node$get.x,
      y = _textElement$node$get.y,
      width = _textElement$node$get.width,
      height = _textElement$node$get.height;

  var computedWidth = textElement.node().getComputedTextLength();
  parentContainer.select("#".concat(uniqueId)).remove();

  if (DEBUG_OUTPUT_DISCREPANCY && Math.abs(computedWidth - width) > 1) {
    console.warn("getHorizontalLabelDimensionsUsingSvgApproximation('".concat(text, "'): discrepancy between getBbox().width and getComputedTextLength (bb:").concat(width, ", comp:").concat(computedWidth));
  }

  if (DEBUG_OUTPUT_NON_ZERO_OFFSETS && x !== 0) {
    console.warn("getHorizontalLabelDimensionsUsingSvgApproximation('".concat(text, "'): got non zero x offset: ").concat(x));
  }

  if (DEBUG_OUTPUT_NON_ZERO_OFFSETS && y !== 0) {
    console.warn("getHorizontalLabelDimensionsUsingSvgApproximation('".concat(text, "'): got non zero y offset: ").concat(y));
  }

  return {
    width: width,
    height: height,
    computedWidth: computedWidth
  };
}

module.exports = getHorizontalLabelDimensionsUsingSvgApproximation;