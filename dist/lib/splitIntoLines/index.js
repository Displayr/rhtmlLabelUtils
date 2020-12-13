"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getSingleLineLabelDimensions = require('../getSingleLineLabelDimensions');

var _require = require('../enums'),
    _require$orientation = _require.orientation,
    HORIZONTAL = _require$orientation.HORIZONTAL,
    NORTH_EAST = _require$orientation.NORTH_EAST,
    SOUTH_EAST = _require$orientation.SOUTH_EAST,
    wrap = _require.wrap;

var validateFontSizeAndConvertNumeric = require('../../utils/validateFontSizeAndConvertNumeric'); // TODO the _splitIntoLines needs a cleanup, but first it needs some test coverage
// I have not really touched this file (yet) since extracting it into labelUtils repo
// NB not sure if this will work. Depends if font rendering is same size wise horizontal vs vertical


var translateToHorizontal = function translateToHorizontal(_ref) {
  var orientation = _ref.orientation,
      maxWidth = _ref.maxWidth,
      maxHeight = _ref.maxHeight;

  if ([HORIZONTAL, NORTH_EAST, SOUTH_EAST].includes(orientation)) {
    return {
      orientation: orientation,
      maxWidth: maxWidth,
      maxHeight: maxHeight
    };
  } else {
    return {
      orientation: HORIZONTAL,
      maxWidth: maxHeight,
      // NB swap is deliberate, not a typo
      maxHeight: maxWidth // NB swap is deliberate, not a typo

    };
  }
};

var wordTokenizer = function wordTokenizer(inputString) {
  return inputString.replace(/<br>/g, ' <br> ').split(' ').map(function (token) {
    return token.trim();
  }).filter(function (token) {
    return token.length;
  });
};

var splitIntoLinesWithInfo = function splitIntoLinesWithInfo(input) {
  if (input.text.length === 0) {
    return [input.text];
  }

  var tokens = input.wrap === wrap.WORD ? wordTokenizer(input.text) : input.text.split('');
  var joinCharacter = input.wrap === wrap.WORD ? ' ' : ''; // TODO can i safely use Array.includes here given by current babel setup ?

  if ([NORTH_EAST, SOUTH_EAST].includes(input.orientation) && (!input.maxLines || !input.maxLines === 1)) {
    throw new Error('rhtmlLabelUtils does not handle wrapping of diagonal labels yet. maxLines must be set to 1 for diagonal labels.');
  }

  return _splitIntoLines(_objectSpread(_objectSpread({}, input), {}, {
    tokens: tokens,
    joinCharacter: joinCharacter
  }));
};

var splitIntoLines = function splitIntoLines(input) {
  return splitIntoLinesWithInfo(input).map(function (lineWithInfo) {
    return lineWithInfo.text;
  });
};

var _splitIntoLines = function _splitIntoLines() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      parentContainer = _ref2.parentContainer,
      _ref2$fontSize = _ref2.fontSize,
      fontSizeStringOrNumber = _ref2$fontSize === void 0 ? 12 : _ref2$fontSize,
      _ref2$fontFamily = _ref2.fontFamily,
      fontFamily = _ref2$fontFamily === void 0 ? 'sans-serif' : _ref2$fontFamily,
      _ref2$fontWeight = _ref2.fontWeight,
      fontWeight = _ref2$fontWeight === void 0 ? 'normal' : _ref2$fontWeight,
      _ref2$maxWidth = _ref2.maxWidth,
      untranslatedMaxWidth = _ref2$maxWidth === void 0 ? null : _ref2$maxWidth,
      _ref2$maxHeight = _ref2.maxHeight,
      untranslatedMaxHeight = _ref2$maxHeight === void 0 ? null : _ref2$maxHeight,
      _ref2$maxLines = _ref2.maxLines,
      maxLines = _ref2$maxLines === void 0 ? null : _ref2$maxLines,
      tokens = _ref2.tokens,
      joinCharacter = _ref2.joinCharacter,
      _ref2$orientation = _ref2.orientation,
      untranslatedOrientation = _ref2$orientation === void 0 ? HORIZONTAL : _ref2$orientation,
      _ref2$innerLinePaddin = _ref2.innerLinePadding,
      innerLinePadding = _ref2$innerLinePaddin === void 0 ? 1 : _ref2$innerLinePaddin;

  var fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber);
  var currentLineTokens = [];
  var linesInfo = [];
  var totalHeight = 0;
  var truncationString = '...';
  var numTruncationCharacters = truncationString.length;
  var token = null;

  var _translateToHorizonta = translateToHorizontal({
    orientation: untranslatedOrientation,
    maxWidth: untranslatedMaxWidth,
    maxHeight: untranslatedMaxHeight
  }),
      orientation = _translateToHorizonta.orientation,
      maxWidth = _translateToHorizonta.maxWidth,
      maxHeight = _translateToHorizonta.maxHeight;

  var toHundredth = function toHundredth(value) {
    return Math.round(value * 100) / 100;
  };

  var isNull = function isNull(value) {
    return value === null;
  };

  var horizontalAndOnFirstLine = function horizontalAndOnFirstLine() {
    return orientation === HORIZONTAL && linesInfo.length === 0;
  };

  var widthExceeded = function widthExceeded(width) {
    return !isNull(maxWidth) && toHundredth(width) > toHundredth(maxWidth);
  };

  var heightExceeded = function heightExceeded(height) {
    return !isNull(maxHeight) && toHundredth(height) > toHundredth(maxHeight);
  };

  var getDimensionsFromString = function getDimensionsFromString(text) {
    return getSingleLineLabelDimensions({
      parentContainer: parentContainer,
      text: text,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      orientation: orientation
    });
  };

  var getDimensionsFromArray = function getDimensionsFromArray(tokenArray) {
    return getDimensionsFromString(tokenArray.join(joinCharacter));
  };

  var getDimensions = function getDimensions(arrayOrString) {
    return Array.isArray(arrayOrString) ? getDimensionsFromArray(arrayOrString) : getDimensionsFromString(arrayOrString);
  };

  function truncateWith() {
    var lastLine = linesInfo[linesInfo.length - 1];
    lastLine.text = "".concat(lastLine.text).concat(truncationString);
    var tooBig = true;

    while (tooBig && lastLine.text.length > 0 && lastLine.text !== truncationString) {
      var _getDimensions = getDimensions(lastLine.text),
          width = _getDimensions.width,
          height = _getDimensions.height,
          xOffset = _getDimensions.xOffset,
          yOffset = _getDimensions.yOffset,
          transform = _getDimensions.transform;

      tooBig = widthExceeded(width);

      if (!tooBig) {
        Object.assign(lastLine, {
          width: width,
          height: height,
          xOffset: xOffset,
          yOffset: yOffset,
          transform: transform
        });
        break;
      }

      lastLine.text = lastLine.text.slice(0, lastLine.text.length - (numTruncationCharacters + 1)) + truncationString;
    }

    linesInfo[linesInfo.length - 1] = lastLine;
  }

  while (token = tokens.shift()) {
    // eslint-disable-line no-cond-assign
    if (token === '<br>') {
      var _getDimensions2 = getDimensions(currentLineTokens),
          _width = _getDimensions2.width,
          _height = _getDimensions2.height,
          _xOffset = _getDimensions2.xOffset,
          _yOffset = _getDimensions2.yOffset,
          _transform = _getDimensions2.transform;

      linesInfo.push({
        text: "".concat(currentLineTokens.join(joinCharacter)),
        width: _width,
        height: _height,
        xOffset: _xOffset,
        yOffset: _yOffset,
        transform: _transform
      });
      totalHeight += _height + innerLinePadding;
      currentLineTokens = [];
      continue;
    }

    currentLineTokens.push(token);

    var _getDimensions3 = getDimensions(currentLineTokens),
        width = _getDimensions3.width,
        height = _getDimensions3.height,
        xOffset = _getDimensions3.xOffset,
        yOffset = _getDimensions3.yOffset,
        transform = _getDimensions3.transform;

    if (heightExceeded(totalHeight + height) && !horizontalAndOnFirstLine()) {
      if (linesInfo.length === 0) {
        // TODO check if the current line still fits, and if not delete characters
        linesInfo.push({
          text: "".concat(currentLineTokens.join(joinCharacter)),
          width: width,
          height: height,
          xOffset: xOffset,
          yOffset: yOffset,
          transform: transform
        });
        truncateWith();
        currentLineTokens = [];
        break;
      } else {
        // TODO check if the modified last line still fits, and if not delete characters
        truncateWith();
        currentLineTokens = [];
        break;
      }
    } // this still allows height to be exceeded ...


    if (widthExceeded(width) && currentLineTokens.length > 1) {
      if (maxLines && linesInfo.length === maxLines - 1) {
        currentLineTokens.pop();
        linesInfo.push({
          text: "".concat(currentLineTokens.join(joinCharacter)),
          width: width,
          height: height,
          xOffset: xOffset,
          yOffset: yOffset,
          transform: transform
        });
        truncateWith();
        currentLineTokens = [];
        break;
      } else {
        tokens.unshift(currentLineTokens.pop());
        linesInfo.push({
          text: "".concat(currentLineTokens.join(joinCharacter)),
          width: width,
          height: height,
          xOffset: xOffset,
          yOffset: yOffset,
          transform: transform
        });
        totalHeight += height + innerLinePadding;
        currentLineTokens = [];
      }
    }
  }

  if (currentLineTokens.length > 0) {
    var _getDimensions4 = getDimensions(currentLineTokens),
        _width2 = _getDimensions4.width,
        _height2 = _getDimensions4.height,
        _xOffset2 = _getDimensions4.xOffset,
        _yOffset2 = _getDimensions4.yOffset,
        _transform2 = _getDimensions4.transform;

    linesInfo.push({
      text: "".concat(currentLineTokens.join(joinCharacter)),
      width: _width2,
      height: _height2,
      xOffset: _xOffset2,
      yOffset: _yOffset2,
      transform: _transform2
    });
  }

  if (linesInfo.length === 0) {
    var _getDimensions5 = getDimensions(truncationString),
        _width3 = _getDimensions5.width,
        _height3 = _getDimensions5.height,
        _xOffset3 = _getDimensions5.xOffset,
        _yOffset3 = _getDimensions5.yOffset,
        _transform3 = _getDimensions5.transform;

    return [{
      text: truncationString,
      width: _width3,
      height: _height3,
      xOffset: _xOffset3,
      yOffset: _yOffset3,
      transform: _transform3
    }];
  }

  return linesInfo;
};

module.exports = {
  splitIntoLines: splitIntoLines,
  splitIntoLinesWithInfo: splitIntoLinesWithInfo
};