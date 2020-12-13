"use strict";

var enums = require('../enums'); // TODO duplicated toRadians fn


var toRadians = function toRadians(degrees) {
  return degrees * (Math.PI / 180);
};

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
      bounds = _ref.bounds,
      _ref$horizontalAlignm = _ref.horizontalAlignment,
      horizontalAlignment = _ref$horizontalAlignm === void 0 ? enums.horizontalAlignment.LEFT : _ref$horizontalAlignm,
      _ref$verticalAlignmen = _ref.verticalAlignment,
      verticalAlignment = _ref$verticalAlignmen === void 0 ? enums.verticalAlignment.TOP : _ref$verticalAlignmen;
  var _linesWithInfo$ = linesWithInfo[0],
      text = _linesWithInfo$.text,
      xOffset = _linesWithInfo$.xOffset,
      yOffset = _linesWithInfo$.yOffset,
      labelWidth = _linesWithInfo$.width;

  if ([enums.verticalAlignment.CENTER, enums.verticalAlignment.BOTTOM].includes(verticalAlignment)) {
    console.warn("SOUTH_EAST label cannot have verticalAlignment = CENTER or BOTTOM");
  }

  if ([enums.horizontalAlignment.CENTER, enums.horizontalAlignment.RIGHT].includes(horizontalAlignment)) {
    console.warn("SOUTH_EAST label cannot have horizontalAlignment = CENTER or RIGHT");
  }

  var xTransform = 0;
  var yTransform = Math.sin(toRadians(45)) * fontSize / 1.5;
  var textSelection = parentContainer.append('text') // .attr('transform', `translate(${width / 2}, 0),rotate(45)`)
  .attr('transform', "translate(".concat(xTransform, ", ").concat(yTransform, "),rotate(45)")).attr('x', 0).attr('y', 0).attr('dy', 0).style('text-anchor', 'start').style('font-family', fontFamily).style('font-weight', fontWeight).style('font-size', "".concat(fontSize, "px")).style('fill', fontColor).text(text);
  return textSelection;
};