/* global jest */
/* global expect */

import 'core-js/stable'
import 'regenerator-runtime/runtime'

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

const {
  executeReset,
  executeGetSvgCanvasBoundingBox,
  waitForTestPageToLoad,
} = require('../utils/pageInteractions')

jest.setTimeout(timeout)
const toMatchImageSnapshot = configureToMatchImageSnapshot(imageSnapshotSettings)
expect.extend({ toMatchImageSnapshot })

const { horizontalAlignment, verticalAlignment, orientation } = require('../../src/lib/enums')

describe('addHorizontalWrappedLabel:', () => {
  let browser
  let page
  let svgBoundingBox

  beforeAll(async () => {
    browser = await puppeteer.launch(puppeteerSettings)
    page = await browser.newPage()
    page.on('console', (msg) => console.log(msg._text))
    await page.goto(testUrl)
    await waitForTestPageToLoad({ page })

    svgBoundingBox = await executeGetSvgCanvasBoundingBox({ page })
  })

  afterAll(async () => {
    await page.close()
    await browser.close()
  })

  test('alignment combinations', async () => {
    await executeReset({ page })

    const bounds = { width: 100, height: 100 }
    const offset = { x: 0, y: 0 }

    function thisIsExecutedRemotely (offset, bounds) {
      return window.callAddLabel({
        text: '1 22 333 4444 55555 6666666 55555 4444 333 22 1',
        offset,
        bounds,
      })
    }

    await page.evaluate(thisIsExecutedRemotely, offset, bounds)

    let svgCanvas = await page.$(canvasSelector)
    let image = await svgCanvas.screenshot({
      clip: {
        x: svgBoundingBox.x + originOffset - snapshotExtraPadding,
        y: svgBoundingBox.y + originOffset - snapshotExtraPadding,
        width: Math.max(100, offset.x + bounds.width + 2 * snapshotExtraPadding),
        height: Math.max(20, offset.y + bounds.height + 2 * snapshotExtraPadding),
      }
    })

    expect(image).toMatchImageSnapshot({ customSnapshotIdentifier: 'addLabel' })
  })
})