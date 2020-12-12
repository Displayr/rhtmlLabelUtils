"use strict";

var splitIntoLines = require('./splitIntoLines');

var enums = require('./enums');

var validateFontSizeAndConvertNumeric = require('../utils/validateFontSizeAndConvertNumeric');

var horizontalRenderer = require('./render/horizontal');

var topToBottomRenderer = require('./render/topToBottom');

var bottomToTopRenderer = require('./render/bottomToTop');

var addLabel = function addLabel(_ref) {
  var parentContainer = _ref.parentContainer,
      _ref$text = _ref.text,
      text = _ref$text === void 0 ? 'test label' : _ref$text,
      _ref$fontSize = _ref.fontSize,
      fontSizeStringOrNumber = _ref$fontSize === void 0 ? 12 : _ref$fontSize,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === void 0 ? 'sans-serif' : _ref$fontFamily,
      _ref$fontWeight = _ref.fontWeight,
      fontWeight = _ref$fontWeight === void 0 ? 'normal' : _ref$fontWeight,
      _ref$fontColor = _ref.fontColor,
      fontColor = _ref$fontColor === void 0 ? '#000000' : _ref$fontColor,
      _ref$bounds = _ref.bounds,
      bounds = _ref$bounds === void 0 ? {
    width: 100,
    height: 100
  } : _ref$bounds,
      _ref$maxLines = _ref.maxLines,
      maxLines = _ref$maxLines === void 0 ? null : _ref$maxLines,
      _ref$orientation = _ref.orientation,
      orientation = _ref$orientation === void 0 ? enums.orientation.HORIZONTAL : _ref$orientation,
      _ref$wrap = _ref.wrap,
      wrap = _ref$wrap === void 0 ? enums.wrap.WORD : _ref$wrap,
      _ref$verticalAlignmen = _ref.verticalAlignment,
      verticalAlignment = _ref$verticalAlignmen === void 0 ? enums.verticalAlignment.TOP : _ref$verticalAlignmen,
      _ref$horizontalAlignm = _ref.horizontalAlignment,
      horizontalAlignment = _ref$horizontalAlignm === void 0 ? enums.horizontalAlignment.CENTER : _ref$horizontalAlignm,
      _ref$innerLinePadding = _ref.innerLinePadding,
      innerLinePadding = _ref$innerLinePadding === void 0 ? 1 : _ref$innerLinePadding;
  // TODO INPUT VALIDATION
  var fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber);
  var lines = splitIntoLines({
    parentContainer: parentContainer,
    wrap: wrap,
    text: text,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    maxWidth: bounds.width,
    maxHeight: bounds.height,
    maxLines: maxLines,
    orientation: orientation,
    innerLinePadding: parseFloat(innerLinePadding)
  });
  var renderer = getRenderer(orientation);
  return renderer({
    parentContainer: parentContainer,
    lines: lines,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    fontColor: fontColor,
    bounds: bounds,
    verticalAlignment: verticalAlignment,
    horizontalAlignment: horizontalAlignment,
    innerLinePadding: parseFloat(innerLinePadding)
  });
};

var getRenderer = function getRenderer(orientation) {
  switch (orientation) {
    case enums.orientation.HORIZONTAL:
      return horizontalRenderer;

    case enums.orientation.TOP_TO_BOTTOM:
      return topToBottomRenderer;

    case enums.orientation.BOTTOM_TO_TOP:
      return bottomToTopRenderer;

    default:
      throw new Error("unknown orientation: '".concat(orientation, "'"));
  }
};

module.exports = addLabel;