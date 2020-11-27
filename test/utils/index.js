import 'core-js/stable'
import 'regenerator-runtime/runtime'

const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const puppeteer = require('puppeteer')

const {
  timeout,
  imageSnapshotSettings,
  ...restOfSettings
} = require('./getLabelDimensions.settings')

const asyncForEach =

jest.setTimeout(timeout)
expect.extend({ toMatchImageSnapshot: configureToMatchImageSnapshot(imageSnapshotSettings) })

module.exports = {
  settings: {
    timeout,
    imageSnapshotSettings,
    ...restOfSettings
  },
  pageInteractions: require('./pageInteractions'),
  asyncUtils: require('./asyncUtils'),
  testSetup: require('./testSetup'),
  puppeteer,
}
