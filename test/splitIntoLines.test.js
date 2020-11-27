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

const testCases = require('./getLabelDimensions.testCases')
const tests = testCases.map(testConfig => [`horizontal-${testConfig.name}`, testConfig]) // map to expected jest test.each format

jest.setTimeout(timeout)
const toMatchImageSnapshot = configureToMatchImageSnapshot(imageSnapshotSettings)
expect.extend({ toMatchImageSnapshot })

describe('split into lines:', () => {
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

  test('splitIntoLines', async () => {
    await executeReset({ page })

    function thisIsExecutedRemotely () {
      return window.executeSplintIntoLinesByWord({
        text: 'line 1 of output line 2 of output',
        fontSize: 12,
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
        maxWidth: 100,
        maxHeight: null,
      })
    }

    const output = await page.evaluate(thisIsExecutedRemotely)

    expect(output).toEqual([
      'line 1 of output',
      'line 2 of output',
    ])
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
