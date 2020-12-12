"use strict";

var enums = require('../enums');

module.exports = function (_ref) {
  var parentContainer = _ref.parentContainer,
      linesWithInfo = _ref.linesWithInfo,
      _ref$fontSize = _ref.fontSize,
      fontSize = _ref$fontSize === void 0 ? 12 : _ref$fontSize,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === void 0 ? 'sans-serif' : _ref$fontFamily,
      _ref$fontWeight = _ref.fontWeight,
      fontWeight = _ref$fontWeight === void 0 ? 'normal' : _ref$fontWeight,
      _ref$fontColor = _ref.fontColor,
      fontColor = _ref$fontColor === void 0 ? '#000000' : _ref$fontColor,
      _ref$bounds = _ref.bounds;
  _ref$bounds = _ref$bounds === void 0 ? {
    width: 100,
    height: 100
  } : _ref$bounds;
  var width = _ref$bounds.width,
      height = _ref$bounds.height,
      _ref$verticalAlignmen = _ref.verticalAlignment,
      verticalAlignment = _ref$verticalAlignmen === void 0 ? enums.verticalAlignment.TOP : _ref$verticalAlignmen,
      _ref$horizontalAlignm = _ref.horizontalAlignment,
      horizontalAlignment = _ref$horizontalAlignm === void 0 ? enums.horizontalAlignment.CENTER : _ref$horizontalAlignm,
      _ref$innerLinePadding = _ref.innerLinePadding,
      innerLinePadding = _ref$innerLinePadding === void 0 ? 1 : _ref$innerLinePadding;
  // TODO do not use fontSize as a proxy for line height
  var extraSpace = height - (fontSize * linesWithInfo.length + innerLinePadding * (linesWithInfo.length - 1));
  var textYOffset = verticalAlignment === enums.verticalAlignment.CENTER && extraSpace > 0 ? extraSpace / 2 : 0;
  var textSelection = parentContainer.append('text').attr('x', 0).attr('y', 0).attr('dy', 0).style('font-family', fontFamily).style('font-size', "".concat(fontSize, "px")).style('font-weight', fontWeight).style('fill', fontColor);

  switch (horizontalAlignment) {
    case enums.horizontalAlignment.LEFT:
      textSelection.attr('transform', "translate(0, ".concat(textYOffset, ")")).style('text-anchor', 'start');
      break;

    case enums.horizontalAlignment.CENTER:
      textSelection.attr('transform', "translate(".concat(width / 2, ", ").concat(textYOffset, ")")).style('text-anchor', 'middle');
      break;

    case enums.horizontalAlignment.RIGHT:
      textSelection.attr('transform', "translate(".concat(width, ", ").concat(textYOffset, ")")).style('text-anchor', 'end');
      break;

    default:
      throw new Error("unknown horizontal alignment: '".concat(horizontalAlignment, "'"));
  } // TODO I didn't test or understand this code, just ported it over


  var useBoundsIfFirstRowAndFontTooLarge = function useBoundsIfFirstRowAndFontTooLarge(i) {
    return i === 0 ? Math.min(height, fontSize) : fontSize;
  };

  switch (verticalAlignment) {
    case enums.verticalAlignment.TOP:
      linesWithInfo.forEach(function (_ref2, i) {
        var text = _ref2.text;
        textSelection.append('tspan').style('dominant-baseline', 'text-before-edge').attr('x', 0).attr('y', i * (fontSize + innerLinePadding)).text(text);
      });
      break;

    case enums.verticalAlignment.CENTER:
      linesWithInfo.forEach(function (_ref3, i) {
        var text = _ref3.text;
        textSelection.append('tspan').style('dominant-baseline', 'central').attr('x', 0).attr('y', useBoundsIfFirstRowAndFontTooLarge(i) / 2 + i * (fontSize + innerLinePadding)).text(text);
      });
      break;

    case enums.verticalAlignment.BOTTOM:
      linesWithInfo.reverse().forEach(function (_ref4, i) {
        var text = _ref4.text;
        textSelection.append('tspan').style('dominant-baseline', 'text-after-edge').attr('x', 0).attr('y', height - i * (fontSize + innerLinePadding)).text(text);
      });
      break;

    default:
      throw new Error("unknown vertical alignment: '".concat(verticalAlignment, "'"));
  }

  return textSelection;
};