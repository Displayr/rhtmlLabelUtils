/* global jest */
/* global expect */

import 'core-js/stable'
import 'regenerator-runtime/runtime'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const { orientation: { HORIZONTAL } } = require('../../src/lib/enums')

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

const testCases = require('../utils/getLabelDimensions.testCases')
const tests = testCases.map(testConfig => [`horizontal-${testConfig.name}`, testConfig]) // map to expected jest test.each format

jest.setTimeout(timeout)
const toMatchImageSnapshot = configureToMatchImageSnapshot(imageSnapshotSettings)
expect.extend({ toMatchImageSnapshot })

describe('getSingleLineLabelDimensions orientation=HORIZONTAL:', () => {
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

  test.each(tests)(`%#: %s`, async (testName, testConfig) => {
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
