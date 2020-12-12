"use strict";

var _ = require('lodash');

var enums = require('./enums');

var getSingleLineLabelDimensions = require('./getSingleLineLabelDimensions');

var _require = require('./splitIntoLines'),
    splitIntoLines = _require.splitIntoLines;

var validateFontSizeAndConvertNumeric = require('../utils/validateFontSizeAndConvertNumeric');

var getDimensions = function getDimensions(_ref) {
  var parentContainer = _ref.parentContainer,
      _ref$text = _ref.text,
      text = _ref$text === void 0 ? 'test label' : _ref$text,
      _ref$fontSize = _ref.fontSize,
      fontSizeStringOrNumber = _ref$fontSize === void 0 ? 12 : _ref$fontSize,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === void 0 ? 'sans-serif' : _ref$fontFamily,
      _ref$fontWeight = _ref.fontWeight,
      fontWeight = _ref$fontWeight === void 0 ? 'normal' : _ref$fontWeight,
      _ref$maxWidth = _ref.maxWidth,
      maxWidth = _ref$maxWidth === void 0 ? null : _ref$maxWidth,
      _ref$maxHeight = _ref.maxHeight,
      maxHeight = _ref$maxHeight === void 0 ? null : _ref$maxHeight,
      _ref$maxLines = _ref.maxLines,
      maxLines = _ref$maxLines === void 0 ? null : _ref$maxLines,
      _ref$orientation = _ref.orientation,
      orientation = _ref$orientation === void 0 ? enums.orientation.HORIZONTAL : _ref$orientation,
      _ref$wrap = _ref.wrap,
      wrap = _ref$wrap === void 0 ? enums.wrap.WORD : _ref$wrap,
      _ref$innerLinePadding = _ref.innerLinePadding,
      innerLinePadding = _ref$innerLinePadding === void 0 ? 1 : _ref$innerLinePadding;
  var fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber);
  var lines = splitIntoLines({
    parentContainer: parentContainer,
    text: text,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    maxLines: maxLines,
    orientation: orientation,
    wrap: wrap,
    innerLinePadding: innerLinePadding
  });
  var lineDimensions = lines.map(function (text) {
    return getSingleLineLabelDimensions({
      parentContainer: parentContainer,
      text: text,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      orientation: orientation,
      wrap: wrap,
      innerLinePadding: innerLinePadding
    });
  });

  switch (orientation) {
    case enums.orientation.HORIZONTAL:
      return {
        width: _(lineDimensions).map('width').max(),
        height: _(lineDimensions).map('height').sum() + (lines.length - 1) * innerLinePadding
      };

    case enums.orientation.TOP_TO_BOTTOM:
      return {
        width: _(lineDimensions).map('width').sum() + (lines.length - 1) * innerLinePadding,
        height: _(lineDimensions).map('height').max()
      };

    case enums.orientation.BOTTOM_TO_TOP:
      return {
        width: _(lineDimensions).map('width').sum() + (lines.length - 1) * innerLinePadding,
        height: _(lineDimensions).map('height').max()
      };

    default:
      throw new Error("unknown orientation: '".concat(orientation, "'"));
  }
};

module.exports = getDimensions;