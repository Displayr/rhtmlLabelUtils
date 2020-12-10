const _ = require('lodash')
const enums = require('../../src/lib/enums')

module.exports = {
  singleLine: require('./singleLine.testCases'),
  horizontalOrientation: {
    alignment: require('./alignmentBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.HORIZONTAL })),
    wrappingBoundaries: require('./wrappingBoundariesBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.HORIZONTAL })),
    fontVariations: require('./fontVariationsBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.HORIZONTAL })),
  },
  topToBottomOrientation: {
    alignment: require('./alignmentBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.TOP_TO_BOTTOM })),
    wrappingBoundaries: require('./wrappingBoundariesBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.TOP_TO_BOTTOM })),
    fontVariations: require('./fontVariationsBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.TOP_TO_BOTTOM })),
  },
  bottomToTopOrientation: {
    alignment: require('./alignmentBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.BOTTOM_TO_TOP })),
    wrappingBoundaries: require('./wrappingBoundariesBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.BOTTOM_TO_TOP })),
    fontVariations: require('./fontVariationsBase.testCases')
      .map(testCase => _.merge({}, testCase, { orientation: enums.orientation.BOTTOM_TO_TOP })),
  },
}