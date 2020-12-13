/* global jest */
/* global expect */

const _ = require('lodash')

const {
  pageInteractions: { executeReset },
  testSetup: { beforeAllFixtureFactory, afterAllFixtureFactory },
  getTestGroupName,
} = require('../utils')

const enums = require('../../src/lib/enums')

const splitByWordsTestCases = [
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
    text: 'abcdefghijklmnopqrstuvwxyaabcdefghijklmnopqrstuvwxya',
    maxWidth: 100,
    maxLines: 1,
    orientation: enums.orientation.HORIZONTAL,
    expected: ['abcdefghijklmnopqrstuvwxyaabcdefghijklmnopqrstuvwxya'],
    name: 'BUG: single large word causes label to go out of bounds',
  },

  // inner line padding respected
  {
    text: 'line 1 of output line 2 of output line 3 of output',
    maxWidth: 100,
    maxHeight: 100,
    innerLinePadding: 50,
    orientation: enums.orientation.HORIZONTAL,
    expected: ['line 1 of output', 'line 2 of output...'],
    name: 'inner line padding causes second line to get dropped',
  },

  // font size respected
  {
    text: 'line 1 of output line 2 of output line 3 of output',
    maxWidth: 300,
    maxHeight: 100,
    fontSize: 40,
    orientation: enums.orientation.HORIZONTAL,
    expected: ['line 1 of output', 'line 2 of output...'],
    name: 'inner line padding causes second line to get dropped',
  },

  // font weight respected
  {
    text: 'line 1 of output',
    maxWidth: 79,
    maxLines: 1,
    orientation: enums.orientation.HORIZONTAL,
    expected: ['line 1 of output'],
    name: 'font weight baseline : with normal weight it fits',
  },
  {
    text: 'line 1 of output',
    maxWidth: 79,
    maxLines: 1,
    fontWeight: 'bold',
    orientation: enums.orientation.HORIZONTAL,
    expected: ['line 1 of...'],
    name: 'font weight : with bold weight it must truncate',
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

// skip orientation tests as we tested them on spoklitByWord and we know/assume the implementations are the same
const splitByCharacterTestCases = [
  {
    text: 'line 1 of output line 2 of output',
    maxWidth: 100,
    expected: ['line 1 of output lin', 'e 2 of output'],
    name: 'basic horizontal split into two lines',
  },
  {
    text: 'abcdefghijklmnopqrstuvwxyaabcdefghijklmnopqrstuvwxya',
    maxWidth: 100,
    maxLines: 1,
    orientation: enums.orientation.HORIZONTAL,
    expected: ['abcdefghijklmno...'],
    name: 'single large word is correctly truncated',
  },
]

describe('splitIntoLinesByWord:', () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope))
  afterAll(afterAllFixtureFactory(testScope))

  const tests = splitByWordsTestCases.map((testConfig, i) => [`splitIntoLinesByWord-${testConfig.name || i}`, testConfig]) // map to expected jest test.each format
  test.each(tests)(`%#: %s`, async (testName, testConfig) => {
      const { page } = testScope
      await executeReset({ page })
      function thisIsExecutedRemotely (testConfig) {
        return window.testFixture.splitIntoLines(testConfig)
      }
      const output = await page.evaluate(thisIsExecutedRemotely, _.merge({}, testConfig, { wrap: enums.wrap.WORD }))
      expect(output).toEqual(testConfig.expected)
  })
})

describe('splitIntoLinesByCharacter:', () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope))
  afterAll(afterAllFixtureFactory(testScope))

  const tests = splitByCharacterTestCases.map((testConfig, i) => [`splitByCharacterTestCases-${testConfig.name || i}`, testConfig]) // map to expected jest test.each format
  test.each(tests)(`%#: %s`, async (testName, testConfig) => {
    const { page } = testScope
    await executeReset({ page })
    function thisIsExecutedRemotely (testConfig) {
      return window.testFixture.splitIntoLines(testConfig)
    }
    const output = await page.evaluate(thisIsExecutedRemotely, _.merge({}, testConfig, { wrap: enums.wrap.CHARACTER }))
    expect(output).toEqual(testConfig.expected)
  })
})
