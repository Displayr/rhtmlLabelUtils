/* global jest */
/* global expect */

const _ = require('lodash')

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

const enums = require('../../src/lib/enums')
const {
  horizontalAlignment: { LEFT, CENTER: H_CENTER, RIGHT },
  verticalAlignment: { TOP, CENTER: V_CENTER, BOTTOM },
} = enums

const testGroup = getTestGroupName(__filename)
describe(`${testGroup}:`, () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope, testGroup))
  afterAll(afterAllFixtureFactory(testScope))

  test('alignment combinations', async () => {
    const combinations = _([LEFT, H_CENTER, RIGHT])
      .map((horizontalAlignment, hIndex) => {
        return [TOP, V_CENTER, BOTTOM].map((verticalAlignment, vIndex) => ({
          horizontalAlignment,
          offset: {x: hIndex * (100 + 20), y: vIndex * (100 + 20)},
          verticalAlignment,
          orientation: enums.orientation.HORIZONTAL,
          text: '1 22 333 4444 55555 6666666 55555 4444 333 22 1',
          bounds: { width: 100, height: 100 },
        }))
      })
      .flatten()
      .value()

    return executeCombinationsAndSnapshot({
      customSnapshotIdentifier: 'horizontal-wrapped-label-alignment-combos',
      combinations,
      testScope
    })
  })

  test('confirm wrapping occurs near edge boundary', async () => {
    const combinations = [
      {
        orientation: enums.orientation.HORIZONTAL,
        horizontalAlignment: enums.horizontalAlignment.LEFT,
        text: '1 22 333 11111111 1 22 333 111111111',
        offset: {x: 0, y: 0 },
        bounds: {width: 100, height: 100},
      }
    ]

    return executeCombinationsAndSnapshot({
      customSnapshotIdentifier: 'horizontal-wrapping-boundary-accuracy-tests',
      combinations,
      testScope
    })
  })

  test('font color,weight,size,family visual test', async () => {
    const combinations = [
      {
        orientation: enums.orientation.HORIZONTAL,
        horizontalAlignment: enums.horizontalAlignment.LEFT,
        fontSize: "24",
        fontColor: "red",
        fontWeight: "bold",
        fontFamily: "Times",
        text: "1 22 333 44 1 22 333 111111111",
        offset: { x: 0, y: 0 },
        bounds: {width: 100, height: 100},
      }
    ]

    return executeCombinationsAndSnapshot({
      customSnapshotIdentifier: 'horizontal-font-variation-test',
      combinations,
      testScope
    })
  })

})

const executeCombinationsAndSnapshot = async ({ combinations, customSnapshotIdentifier, testScope }) => {
  const { page, svgBoundingBox } = testScope
  await executeReset({page})

  await asyncForEach(combinations, async (combination, index) => {
    function thisIsExecutedRemotely(config) { return window.callAddLabel(config) }
    await page.evaluate(thisIsExecutedRemotely, combination)
  })

  const width = _(combinations).map('offset.x').max() + _(combinations).map('bounds.width').max()
  const height = _(combinations).map('offset.y').max() + _(combinations).map('bounds.height').max()
  let svgCanvas = await page.$(canvasSelector)
  let image = await svgCanvas.screenshot({
    clip: {
      x: svgBoundingBox.x + originOffset - snapshotExtraPadding,
      y: svgBoundingBox.y + originOffset - snapshotExtraPadding,
      width: Math.max(100, width + 2 * snapshotExtraPadding),
      height: Math.max(20, height + 2 * snapshotExtraPadding),
    }
  })

  expect(image).toMatchImageSnapshot({ customSnapshotIdentifier })

  return
}