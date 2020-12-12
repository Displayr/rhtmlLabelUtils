"use strict";

module.exports = function (fontSizeStringOrNumber) {
  if (!"".concat(fontSizeStringOrNumber).match(/^[\d]+(px)?$/)) {
    throw new Error("Invalid fontSize '".concat(fontSizeStringOrNumber, "'. Must be numeric with optional trailing 'px'. (em|rem) not supported"));
  }

  return typeof fontSizeStringOrNumber === 'number' ? fontSizeStringOrNumber : parseFloat(fontSizeStringOrNumber.replace(/px$/, ''));
};