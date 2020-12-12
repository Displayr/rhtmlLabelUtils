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

const { orientation: { NORTH_EAST } } = require('../../src/lib/enums')
const testCases = require('../data/singleLine.testCases')
const tests = testCases.map(testConfig => [`diagonal-north-east-${testConfig.name}`, testConfig]) // map to expected jest test.each format

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
    let widestSnapshot = 0
    await asyncForEach(combinations, async (combination, index) => {
      const output = await executeGetLabelDimensionsInBrowser({
        page,
        input: {
          ...combination,
          text: testConfig.text,
          offset: { x: 25 * index, y: 25 * index }
        }
      })
      if (testConfig.output) { expect(output).toEqual(testConfig.output) }
      currentOffset += 25
      widestSnapshot = Math.max(widestSnapshot, output.width)
    })

    let svgCanvas = await page.$(canvasSelector)
    let image = await svgCanvas.screenshot({
      clip: {
        x: svgBoundingBox.x + originOffset - snapshotExtraPadding,
        y: svgBoundingBox.y + originOffset - snapshotExtraPadding,
        width: widestSnapshot + currentOffset,
        height: widestSnapshot + currentOffset
      }
    })

    expect(image).toMatchImageSnapshot({ customSnapshotIdentifier: testName })
  })
})

const executeGetLabelDimensionsInBrowser = async ({ page, input }) => {
  function thisIsExecutedRemotely (input, orientation) {
    return window.testFixture.getSingleLineLabelDimensions(Object.assign(input, { orientation })) // renderSingleLineLabel is defined in renderLabels.html
  }
  return page.evaluate(thisIsExecutedRemotely, input, NORTH_EAST)
}
