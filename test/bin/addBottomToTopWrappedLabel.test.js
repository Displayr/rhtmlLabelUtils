const _ = require('lodash')

const {
  testSetup: { beforeAllFixtureFactory, afterAllFixtureFactory, addTestcasesToPageAndTakeSnapshot },
  getTestGroupName,
} = require('../utils')

const testCases = require('../data').bottomToTopOrientation

const testGroup = getTestGroupName(__filename)
describe(`${testGroup}:`, () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope, testGroup))
  afterAll(afterAllFixtureFactory(testScope))

  test('alignment combinations', async () => {
    return addTestcasesToPageAndTakeSnapshot({
      customSnapshotIdentifier: 'bottom-to-top-wrapped-label-alignment-combos',
      testCases: testCases.alignment,
      testScope
    })
  })

  test('confirm wrapping occurs near edge boundary', async () => {
    return addTestcasesToPageAndTakeSnapshot({
      customSnapshotIdentifier: 'bottom-to-top-wrapping-boundary-accuracy-tests',
      testCases: testCases.wrappingBoundaries,
      testScope
    })
  })

  test('font color,weight,size,family visual test', async () => {
    return addTestcasesToPageAndTakeSnapshot({
      customSnapshotIdentifier: 'bottom-to-top-font-variation-test',
      testCases: testCases.fontVariations,
      testScope
    })
  })
})