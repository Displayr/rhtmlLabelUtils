const path = require('path')

const puppeteerSettings = {
  headless: true, // if set to false, show the browser while testing
    slowMo: 0, // delay each step in the browser interaction by X milliseconds
    defaultViewport: {
    width: 1600,
      height: 1600
  }
}

module.exports = {
  puppeteerSettings,
  imageSnapshotSettings: {
    customSnapshotsDir: path.join(__dirname, `../snapshots/${(puppeteerSettings.headless) ? 'headless' : 'not_headless'}/default`),
    customDiffConfig: {
      threshold: 0.0001
    },
    failureThreshold: 0.0001,
    failureThresholdType: 'percent' // pixel or percent
  },
  timeout: 10000,
  originOffset: 50, // this needs to match up with the origin in renderLabels.html
  snapshotExtraPadding: 10,
  canvasSelector: '#svg-canvas',
  testUrl: `http://localhost:${process.env.PORT || 9000}/content/renderLabels.html`
}
