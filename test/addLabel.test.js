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
} = require('./getLabelDimensions.settings')

jest.setTimeout(timeout)
const toMatchImageSnapshot = configureToMatchImageSnapshot(imageSnapshotSettings)
expect.extend({ toMatchImageSnapshot })

describe('getHorizontalLabelDimensions output and snapshot verification:', () => {
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

  test('addLabel', async () => {
    await executeReset({ page })

    const bounds = { width: 100, height: 100 }
    const offset = { x: 0, y: 0 }

    function thisIsExecutedRemotely (offset, bounds) {
      return window.callAddLabel({
        text: 'foo banana stana rama hama cooko cabana rama stama lorem',
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

const executeReset = async ({ page }) => {
  function thisIsExecutedRemotely () {
    return window.resetSvgContents() // resetSvgContents is defined in renderLabels.html
  }

  return page.evaluate(thisIsExecutedRemotely)
}

const executeGetSvgCanvasBoundingBox = async ({ page }) => {
  function thisIsExecutedRemotely (canvasSelector) {
    const { bottom, height, left, right, top, width, x, y } = document.querySelector(canvasSelector).getBoundingClientRect()
    return { bottom, height, left, right, top, width, x, y }
  }

  return page.evaluate(thisIsExecutedRemotely, canvasSelector)
}

const waitForTestPageToLoad = async ({ page }) => page.waitForFunction(selectorString => {
  return document.querySelectorAll(selectorString).length
}, { timeout }, canvasSelector)
