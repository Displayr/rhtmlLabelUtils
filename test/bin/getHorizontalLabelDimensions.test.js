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
  testSetup: { beforeAllFixtureFactory, afterAllFixtureFactory }
} = require('../utils')

const { orientation: { HORIZONTAL } } = require('../../src/lib/enums')
const testCases = require('../data/singleLine.testCases')
const tests = testCases.map(testConfig => [`horizontal-${testConfig.name}`, testConfig]) // map to expected jest test.each format

describe('getSingleLineLabelDimensions orientation=HORIZONTAL:', () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope))
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
          offset: { x: 0, y: currentOffset }
        }
      })
      if (testConfig.output) { expect(output).toEqual(testConfig.output) }
      currentOffset += (output.height + 20)
      widestSnapshot = Math.max(widestSnapshot, output.width)
    })

    let svgCanvas = await page.$(canvasSelector)
    let image = await svgCanvas.screenshot({
      clip: {
        x: svgBoundingBox.x + originOffset - snapshotExtraPadding,
        y: svgBoundingBox.y + originOffset - snapshotExtraPadding,
        width: Math.max(100, widestSnapshot + 2 * snapshotExtraPadding),
        height: Math.max(20, currentOffset + 2 * snapshotExtraPadding)
      }
    })

    expect(image).toMatchImageSnapshot({ customSnapshotIdentifier: testName })
  })
})

const executeGetLabelDimensionsInBrowser = async ({ page, input }) => {
  function thisIsExecutedRemotely (input, orientation) {
    return window.renderSingleLineLabel(Object.assign(input, { orientation })) // renderSingleLineLabel is defined in renderLabels.html
  }
  return page.evaluate(thisIsExecutedRemotely, input, HORIZONTAL)
}
