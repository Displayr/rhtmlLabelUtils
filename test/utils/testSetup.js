const _ = require('lodash')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const path = require('path')
const puppeteer = require('puppeteer')
const { testUrl, puppeteerSettings, imageSnapshotSettings } = require('./getLabelDimensions.settings')
const { executeGetSvgCanvasBoundingBox, waitForTestPageToLoad } = require('./pageInteractions')

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

module.exports = {
  beforeAllFixtureFactory,
  afterAllFixtureFactory
}
