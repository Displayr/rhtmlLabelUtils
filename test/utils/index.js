import 'core-js/stable'
import 'regenerator-runtime/runtime'

const _ = require('lodash')
const puppeteer = require('puppeteer')

const {
  timeout,
  imageSnapshotSettings,
  ...restOfSettings
} = require('./config')

jest.setTimeout(timeout)

module.exports = {
  getTestGroupName: filePath => _.last(filePath.split('/')).replace(/\.test\.js$/, ''),
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
