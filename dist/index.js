"use strict";

var addLabel = require('./lib/addLabel');

var getDimensions = require('./lib/getDimensions');

var enums = require('./lib/enums');

var getSingleLineLabelDimensions = require('./lib/getSingleLineLabelDimensions');

var splitIntoLines = require('./lib/splitIntoLines');

module.exports = {
  addLabel: addLabel,
  enums: enums,
  getDimensions: getDimensions,
  getSingleLineLabelDimensions: getSingleLineLabelDimensions,
  splitIntoLines: splitIntoLines
};