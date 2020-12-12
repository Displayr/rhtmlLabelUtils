"use strict";

var addLabel = require('./lib/addLabel');

var getDimensions = require('./lib/getDimensions');

var enums = require('./lib/enums');

var getSingleLineLabelDimensions = require('./lib/getSingleLineLabelDimensions');

var _require = require('./lib/splitIntoLines'),
    splitIntoLines = _require.splitIntoLines,
    splitIntoLinesWithInfo = _require.splitIntoLinesWithInfo;

module.exports = {
  addLabel: addLabel,
  enums: enums,
  getDimensions: getDimensions,
  getSingleLineLabelDimensions: getSingleLineLabelDimensions,
  splitIntoLines: splitIntoLines,
  splitIntoLinesWithInfo: splitIntoLinesWithInfo
};