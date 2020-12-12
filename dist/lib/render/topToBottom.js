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
  // TODO do not use fontSize as a proxy for rotated line width
  var consumedWidth = fontSize * linesWithInfo.length + innerLinePadding * (linesWithInfo.length - 1);
  var initialXOffset = 0;

  if (horizontalAlignment === enums.horizontalAlignment.CENTER) {
    initialXOffset = (width - consumedWidth) / 2;
  }

  if (horizontalAlignment === enums.horizontalAlignment.RIGHT) {
    initialXOffset = width - consumedWidth;
  }

  linesWithInfo.reverse().forEach(function (_ref2, i) {
    var text = _ref2.text;
    var container = parentContainer.append('g').attr('transform', "translate(".concat(initialXOffset + i * (fontSize + innerLinePadding), ",0)"));
    var textElement = container.append('text').attr('class', "test-label").attr('x', 0).attr('y', 0).attr('dy', 0).attr('dominant-baseline', 'text-after-edge').style('fill', fontColor);
    textElement.append('tspan').attr('x', 0).attr('y', 0).style('font-size', "".concat(fontSize, "px")).style('font-family', fontFamily).style('font-weight', fontWeight).style('dominant-baseline', 'text-after-edge').text(text);

    switch (verticalAlignment) {
      case enums.verticalAlignment.TOP:
        textElement.attr('transform', "translate(0,0),rotate(90)").style('text-anchor', 'start');
        break;

      case enums.verticalAlignment.CENTER:
        textElement.attr('transform', "translate(0,".concat(height / 2, "),rotate(90)")).style('text-anchor', 'middle');
        break;

      case enums.verticalAlignment.BOTTOM:
        textElement.attr('transform', "translate(0,".concat(height, "),rotate(90)")).style('text-anchor', 'end');
        break;

      default:
        throw new Error("unknown vertical alignment: '".concat(verticalAlignment, "'"));
    }
  });
  return parentContainer.select('text');
};