/* global jest */
/* global expect */

import 'core-js/stable'
import 'regenerator-runtime/runtime'

const _ = require('lodash')
const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const {
  puppeteerSettings,
  imageSnapshotSettings,
  timeout,
  originOffset, // must match renderLabels.html
  canvasSelector,
  testUrl,
  snapshotExtraPadding
} = require('../utils/getLabelDimensions.settings')

const { executeReset, executeGetSvgCanvasBoundingBox, waitForTestPageToLoad } = require('../utils/pageInteractions')
const asyncForEach = require('../utils/asyncForEach')

jest.setTimeout(timeout)
const toMatchImageSnapshot = configureToMatchImageSnapshot(imageSnapshotSettings)
expect.extend({ toMatchImageSnapshot })

const enums = require('../../src/lib/enums')
const {
  horizontalAlignment: { LEFT, CENTER: H_CENTER, RIGHT },
  verticalAlignment: { TOP, CENTER: V_CENTER, BOTTOM },
} = enums

describe('addHorizontalWrappedLabel:', () => {
  let browser
  let page
  let svgBoundingBox

  beforeAll(async () => {
    browser = await puppeteer.launch(puppeteerSettings)
    page = await browser.newPage()
    page.on('console', (msg) => console.log(msg._text))
    await page.goto(testUrl)
    await waitForTestPageToLoad({page})

    svgBoundingBox = await executeGetSvgCanvasBoundingBox({page})
  })

  afterAll(async () => {
    await page.close()
    await browser.close()
  })

  test('alignment combinations', async () => {
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
