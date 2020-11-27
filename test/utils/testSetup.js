const puppeteer = require('puppeteer')
const { testUrl, puppeteerSettings } = require('./getLabelDimensions.settings')
const { executeGetSvgCanvasBoundingBox, waitForTestPageToLoad } = require('./pageInteractions')

const beforeAllFixtureFactory = (testScope) => async () => {
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
