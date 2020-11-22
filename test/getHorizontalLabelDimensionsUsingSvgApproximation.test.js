/* global jest */
/* global expect */

import "core-js/stable";
import "regenerator-runtime/runtime";

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
} = require('./getHorizontalLabelDimensionsUsingSvgApproximation.settings')

const testCases = require('./getHorizontalLabelDimensionsUsingSvgApproximation.testCases')
const tests = testCases.map(testConfig => [testConfig.name, testConfig]) // map to expected jest test.each format

jest.setTimeout(timeout)
const toMatchImageSnapshot = configureToMatchImageSnapshot(imageSnapshotSettings)
expect.extend({ toMatchImageSnapshot })

const ECHO_COMPUTED_DIMENSIONS = false // NB useful for seeding text expectations

describe('getHorizontalLabelDimensionsUsingSvgApproximation output and snapshot verification:', () => {
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
    let maxWidth = 0
    await asyncForEach(combinations, async (combination, index) => {
      const output = await executeGetLabelDimensionsUsingSvgApproximationInBrowser({
        page,
        input: {
          ...combination,
          text: testConfig.text,
          offset: { x: 0, y: currentOffset }
        }
      })
      if (testConfig.output) { expect(output).toEqual(testConfig.output) }
      else if (ECHO_COMPUTED_DIMENSIONS) { console.log(`test ${testConfig.name} missing excepted output. Actual output. `, JSON.stringify(output)) }
      currentOffset += (output.height + 20)
      maxWidth = Math.max(maxWidth, output.width)
    })

    let svgCanvas = await page.$(canvasSelector)
    let image = await svgCanvas.screenshot({
      clip: {
        x: svgBoundingBox.x + originOffset - snapshotExtraPadding,
        y: svgBoundingBox.y + originOffset - snapshotExtraPadding,
        width: Math.max(100, maxWidth + 2 * snapshotExtraPadding),
        height: Math.max(20, currentOffset + 2 * snapshotExtraPadding)
      }
    })

    expect(image).toMatchImageSnapshot({ customSnapshotIdentifier: testName })
  })
})

const executeGetLabelDimensionsUsingSvgApproximationInBrowser = async ({ page, input }) => {
  function thisIsExecutedRemotely (input) {
    return window.renderLabel(input) // renderLabel is defined in renderLabels.html
  }

  return page.evaluate(thisIsExecutedRemotely, input)
}

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

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
