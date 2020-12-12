"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var getSingleLineLabelDimensions = require('./getSingleLineLabelDimensions');

var _require = require('./enums'),
    HORIZONTAL = _require.orientation.HORIZONTAL,
    wrap = _require.wrap;

var validateFontSizeAndConvertNumeric = require('../utils/validateFontSizeAndConvertNumeric'); // TODO the _splitIntoLines needs a cleanup, but first it needs some test coverage
// I have not really touched this file (yet) since extracting it into labelUtils repo


var wordTokenizer = function wordTokenizer(inputString) {
  return inputString.replace(/<br>/g, ' <br> ').split(' ').map(function (token) {
    return token.trim();
  }).filter(function (token) {
    return token.length;
  });
};

var splitIntoLines = function splitIntoLines() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$text = _ref.text,
      text = _ref$text === void 0 ? '' : _ref$text,
      wrapChoice = _ref.wrap,
      rest = _objectWithoutProperties(_ref, ["text", "wrap"]);

  if (text.length === 0) {
    return [text];
  }

  var tokens = wrapChoice === wrap.WORD ? wordTokenizer(text) : text.split('');
  var joinCharacter = wrapChoice === wrap.WORD ? ' ' : '';
  return _splitIntoLines(_objectSpread({
    tokens: tokens,
    joinCharacter: joinCharacter
  }, rest));
}; // NB not sure if this will work. Depends if font rendering is same size wise horizontal vs vertical


var translateToHorizontal = function translateToHorizontal(_ref2) {
  var orientation = _ref2.orientation,
      maxWidth = _ref2.maxWidth,
      maxHeight = _ref2.maxHeight;

  if (orientation === HORIZONTAL) {
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

function _splitIntoLines() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      parentContainer = _ref3.parentContainer,
      _ref3$fontSize = _ref3.fontSize,
      fontSizeStringOrNumber = _ref3$fontSize === void 0 ? 12 : _ref3$fontSize,
      _ref3$fontFamily = _ref3.fontFamily,
      fontFamily = _ref3$fontFamily === void 0 ? 'sans-serif' : _ref3$fontFamily,
      _ref3$fontWeight = _ref3.fontWeight,
      fontWeight = _ref3$fontWeight === void 0 ? 'normal' : _ref3$fontWeight,
      _ref3$maxWidth = _ref3.maxWidth,
      untranslatedMaxWidth = _ref3$maxWidth === void 0 ? null : _ref3$maxWidth,
      _ref3$maxHeight = _ref3.maxHeight,
      untranslatedMaxHeight = _ref3$maxHeight === void 0 ? null : _ref3$maxHeight,
      _ref3$maxLines = _ref3.maxLines,
      maxLines = _ref3$maxLines === void 0 ? null : _ref3$maxLines,
      tokens = _ref3.tokens,
      joinCharacter = _ref3.joinCharacter,
      _ref3$orientation = _ref3.orientation,
      untranslatedOrientation = _ref3$orientation === void 0 ? HORIZONTAL : _ref3$orientation,
      _ref3$innerLinePaddin = _ref3.innerLinePadding,
      innerLinePadding = _ref3$innerLinePaddin === void 0 ? 1 : _ref3$innerLinePaddin;

  var fontSize = validateFontSizeAndConvertNumeric(fontSizeStringOrNumber);
  var currentLine = [];
  var lines = [];
  var totalHeight = 0;
  var truncationString = '...';
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
    return orientation === HORIZONTAL && lines.length === 0;
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
    var lastLine = lines[lines.length - 1];
    var numTruncationCharacters = truncationString.length;
    lastLine = "".concat(lastLine).concat(truncationString);
    var tooBig = true;

    while (tooBig && lastLine.length > 0 && lastLine !== truncationString) {
      var _getDimensions = getDimensions(lastLine),
          width = _getDimensions.width;

      tooBig = widthExceeded(width);

      if (!tooBig) {
        break;
      }

      lastLine = lastLine.slice(0, lastLine.length - (numTruncationCharacters + 1)) + truncationString;
    }

    lines[lines.length - 1] = lastLine;
  }

  while (token = tokens.shift()) {
    // eslint-disable-line no-cond-assign
    if (token === '<br>') {
      var _getDimensions2 = getDimensions(currentLine),
          _height = _getDimensions2.height;

      lines.push("".concat(currentLine.join(joinCharacter)));
      totalHeight += _height + innerLinePadding;
      currentLine = [];
      continue;
    }

    currentLine.push(token);

    var _getDimensions3 = getDimensions(currentLine),
        width = _getDimensions3.width,
        height = _getDimensions3.height;

    if (heightExceeded(totalHeight + height) && !horizontalAndOnFirstLine()) {
      if (lines.length === 0) {
        // TODO check if the current line still fits, and if not delete characters
        lines.push("".concat(currentLine.join(joinCharacter)));
        truncateWith();
        currentLine = [];
        break;
      } else {
        // TODO check if the modified last line still fits, and if not delete characters
        truncateWith();
        currentLine = [];
        break;
      }
    } // this still allows height to be exceeded ...


    if (widthExceeded(width) && currentLine.length > 1) {
      if (maxLines && lines.length === maxLines - 1) {
        currentLine.pop();
        lines.push("".concat(currentLine.join(joinCharacter)));
        truncateWith();
        currentLine = [];
        break;
      } else {
        tokens.unshift(currentLine.pop());
        lines.push("".concat(currentLine.join(joinCharacter)));
        totalHeight += height + innerLinePadding;
        currentLine = [];
      }
    }
  }

  if (currentLine.length > 0) {
    lines.push("".concat(currentLine.join(joinCharacter)));
  }

  return lines.length === 0 ? ['...'] : lines;
}

module.exports = splitIntoLines;