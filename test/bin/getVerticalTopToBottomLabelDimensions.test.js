/* global jest */
/* global expect */

const {
  asyncUtils: { asyncForEach },
  settings: {
    canvasSelector,
    originOffset,
    snapshotExtraPadding,
  },
  pageInteractions: { executeReset },
  testSetup: { beforeAllFixtureFactory, afterAllFixtureFactory },
  getTestGroupName,
} = require('../utils')

const { orientation: { TOP_TO_BOTTOM } } = require('../../src/lib/enums')
const testCases = require('../data/singleLine.testCases')
const tests = testCases.map(testConfig => [`topToBottom-${testConfig.name}`, testConfig]) // map to expected jest test.each format

const testGroup = getTestGroupName(__filename)
describe(`${testGroup}:`, () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope, testGroup))
  afterAll(afterAllFixtureFactory(testScope))

  test.each(tests)(`%#: %s`, async (testName, testConfig) => {
    const { page, svgBoundingBox } = testScope
    await executeReset({ page })

    const combinations = testConfig.combinations

    let currentOffset = originOffset
    let tallestSnapshot = 0
    await asyncForEach(combinations, async (combination, index) => {
      const output = await executeGetLabelDimensionsInBrowser({
        page,
        input: {
          ...combination,
          text: testConfig.text,
          offset: { x: currentOffset, y: 0 }
        }
      })
      if (testConfig.output) { expect(output).toEqual(testConfig.output) }
      currentOffset += (output.width + 20)
      tallestSnapshot = Math.max(tallestSnapshot, output.height)
    })

    let svgCanvas = await page.$(canvasSelector)
    let image = await svgCanvas.screenshot({
      clip: {
        x: svgBoundingBox.x + originOffset - snapshotExtraPadding,
        y: svgBoundingBox.y + originOffset - snapshotExtraPadding,
        width: Math.max(20, currentOffset + 2 * snapshotExtraPadding),
        height: Math.max(100, tallestSnapshot + 2 * snapshotExtraPadding),
      }
    })

    expect(image).toMatchImageSnapshot({ customSnapshotIdentifier: testName })
  })
})

const executeGetLabelDimensionsInBrowser = async ({ page, input }) => {
  function thisIsExecutedRemotely (input, orientation) {
    return window.testFixture.getSingleLineLabelDimensions(Object.assign(input, { orientation })) // renderSingleLineLabel is defined in renderLabels.html
  }
  return page.evaluate(thisIsExecutedRemotely, input, TOP_TO_BOTTOM)
}
