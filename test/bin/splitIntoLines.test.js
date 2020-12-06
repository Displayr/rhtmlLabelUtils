/* global jest */
/* global expect */

const {
  pageInteractions: { executeReset },
  testSetup: { beforeAllFixtureFactory, afterAllFixtureFactory }
} = require('../utils')

const enums = require('../../src/lib/enums')

const testCases = [
  {
    text: 'line 1 of output line 2 of output',
    maxWidth: 100,
    expected: ['line 1 of output', 'line 2 of output'],
    name: 'basic horizontal split into two lines',
  },
  {
    text: 'line 1 of output line 2 of output',
    maxWidth: 100,
    maxLines: 1,
    expected: ['line 1 of output...'],
    name: 'basic horizontal one line with truncations',
  },
  {
    text: 'line 1 of output line 2 of output',
    maxHeight: 100,
    orientation: enums.orientation.TOP_TO_BOTTOM,
    expected: ['line 1 of output', 'line 2 of output'],
    name: 'basic vertical TOP_TO_BOTTOM split into two lines',
  },
  {
    text: 'line 1 of output line 2 of output',
    maxHeight: 100,
    maxLines: 1,
    orientation: enums.orientation.TOP_TO_BOTTOM,
    expected: ['line 1 of output...'],
    name: 'basic vertical TOP_TO_BOTTOM one line with truncations',
  },
  {
    text: 'line 1 of output line 2 of output',
    maxHeight: 100,
    orientation: enums.orientation.BOTTOM_TO_TOP,
    expected: ['line 1 of output', 'line 2 of output'],
    name: 'basic vertical BOTTOM_TO_TOP split into two lines',
  },
  {
    text: 'line 1 of output line 2 of output',
    maxHeight: 100,
    maxLines: 1,
    orientation: enums.orientation.BOTTOM_TO_TOP,
    expected: ['line 1 of output...'],
    name: 'basic vertical BOTTOM_TO_TOP one line with truncations',
  },
  {
    text: 'line 1 of output line 2 of output',
    maxHeight: 100,
    maxLines: 1,
    orientation: enums.orientation.BOTTOM_TO_TOP,
    expected: ['line 1 of output...'],
    name: 'bug: single large word causes wrap',
  },

  // inner line padding respected
  {
    text: 'line 1 of output line 2 of output line 3 of output',
    maxWidth: 100,
    maxHeight: 100,
    innerLinePadding: 50,
    expected: ['line 1 of output', 'line 2 of output...'],
    name: 'inner line padding causes second line to get dropped',
  },

  // font size respected
  {
    text: 'line 1 of output line 2 of output line 3 of output',
    maxWidth: 300,
    maxHeight: 100,
    fontSize: 40,
    expected: ['line 1 of output', 'line 2 of output...'],
    name: 'inner line padding causes second line to get dropped',
  },

  // realistic outputs
  {
    text: 'line 1 of output line 2 of output line 3 of output line 4 of output',
    maxWidth: 100,
    maxHeight: 50,
    expected: [
      'line 1 of output',
      'line 2 of output',
      'line 3 of output...',
    ],
    name: 'width and height constrained, causes truncation',
  },
]

describe('splitIntoLinesByWord:', () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope))
  afterAll(afterAllFixtureFactory(testScope))

  const tests = testCases.map((testConfig, i) => [`splitIntoLinesByWord-${testConfig.name || i}`, testConfig]) // map to expected jest test.each format
  test.each(tests)(`%#: %s`, async (testName, testConfig) => {
      const { page } = testScope
      await executeReset({ page })
      function thisIsExecutedRemotely (testConfig) {
        return window.executeSplintIntoLinesByWord(testConfig)
      }
      const output = await page.evaluate(thisIsExecutedRemotely, testConfig)
      expect(output).toEqual(testConfig.expected)
  })
})
