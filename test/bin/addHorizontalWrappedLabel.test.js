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
  testSetup: { beforeAllFixtureFactory, afterAllFixtureFactory }
} = require('../utils')

const enums = require('../../src/lib/enums')
const {
  horizontalAlignment: { LEFT, CENTER: H_CENTER, RIGHT },
  verticalAlignment: { TOP, CENTER: V_CENTER, BOTTOM },
} = enums

describe('addHorizontalWrappedLabel:', () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope))
  afterAll(afterAllFixtureFactory(testScope))

  test('alignment combinations', async () => {
    const { page, svgBoundingBox } = testScope
    await executeReset({page})

    const bounds = {width: 100, height: 100}

    const combinations = _([LEFT, H_CENTER, RIGHT])
      .map((horizontalAlignment, hIndex) => {
        return [TOP, V_CENTER, BOTTOM].map((verticalAlignment, vIndex) => ({
          horizontalAlignment,
          offset: {x: hIndex * (bounds.width + 20), y: vIndex * (bounds.height + 20)},
          verticalAlignment,
        }))
      })
      .flatten()
      .value()

    await asyncForEach(combinations, async ({horizontalAlignment, offset, verticalAlignment}, index) => {

      function thisIsExecutedRemotely(bounds, horizontalAlignment, offset, verticalAlignment) {
        return window.callAddLabel({
          text: '1 22 333 4444 55555 6666666 55555 4444 333 22 1',
          offset,
          bounds,
          horizontalAlignment,
          verticalAlignment,
        })
      }

      await page.evaluate(thisIsExecutedRemotely, bounds, horizontalAlignment, offset, verticalAlignment)
    })

    const width = _(combinations).map('offset.x').max() + bounds.width
    const height = _(combinations).map('offset.y').max() + bounds.height
    let svgCanvas = await page.$(canvasSelector)
    let image = await svgCanvas.screenshot({
      clip: {
        x: svgBoundingBox.x + originOffset - snapshotExtraPadding,
        y: svgBoundingBox.y + originOffset - snapshotExtraPadding,
        width: Math.max(100, width + 2 * snapshotExtraPadding),
        height: Math.max(20, height + 2 * snapshotExtraPadding),
      }
    })

    expect(image).toMatchImageSnapshot({ customSnapshotIdentifier: 'horizontal-wrapped-label-alignment-combos' })
  })
})
