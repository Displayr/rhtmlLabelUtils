const _ = require('lodash')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const path = require('path')
const puppeteer = require('puppeteer')
const {
  testUrl,
  puppeteerSettings,
  imageSnapshotSettings,
  canvasSelector,
  originOffset,
  snapshotExtraPadding
} = require('./config')
const { executeGetSvgCanvasBoundingBox, waitForTestPageToLoad, executeReset } = require('./pageInteractions')
const { asyncForEach } = require('./asyncUtils')

const beforeAllFixtureFactory = (testScope, snapshotDir = 'default') => async () => {
  expect.extend({ toMatchImageSnapshot: configureToMatchImageSnapshot(_.merge(
    {},
    imageSnapshotSettings,
    { customSnapshotsDir: path.join(__dirname, `../snapshots/${(puppeteerSettings.headless) ? 'headless' : 'not_headless'}/${snapshotDir}`) }
  ))})
  testScope.browser = await puppeteer.launch(puppeteerSettings)
  testScope.page = await testScope.browser.newPage()
  testScope.page.on('console', (msg) => console.log(msg._text))
  await testScope.page.goto(testUrl)
  await waitForTestPageToLoad({ page: testScope.page })

  testScope.svgBoundingBox = await executeGetSvgCanvasBoundingBox({ page: testScope.page })
}

const afterAllFixtureFactory = (testScope) => async () => {
  await testScope.page.close()
  await testScope.browser.close()
}

const addTestcasesToPageAndTakeSnapshot = async ({ testCases, customSnapshotIdentifier, testScope }) => {
  const { page, svgBoundingBox } = testScope
  await executeReset({page})

  await asyncForEach(testCases, async (testCase, index) => {
    function thisIsExecutedRemotely(config) { return window.callAddLabel(config) }
    await page.evaluate(thisIsExecutedRemotely, testCase)
  })

  const width = _(testCases).map('offset.x').max() + _(testCases).map('bounds.width').max()
  const height = _(testCases).map('offset.y').max() + _(testCases).map('bounds.height').max()
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

module.exports = {
  beforeAllFixtureFactory,
  afterAllFixtureFactory,
  addTestcasesToPageAndTakeSnapshot,
}
