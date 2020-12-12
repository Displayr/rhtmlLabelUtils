const _ = require('lodash')

const {
  testSetup: { beforeAllFixtureFactory, afterAllFixtureFactory, addTestcasesToPageAndTakeSnapshot },
  getTestGroupName,
} = require('../utils')

const testCases = require('../data').northEastOrientation

const testGroup = getTestGroupName(__filename)
describe(`${testGroup}:`, () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope, testGroup))
  afterAll(afterAllFixtureFactory(testScope))

  test('alignment combinations', async () => {
    return addTestcasesToPageAndTakeSnapshot({
      customSnapshotIdentifier: 'north-east-wrapped-label-alignment-combos',
      testCases: testCases.alignment,
      testScope
    })
  })

  test('font color,weight,size,family visual test', async () => {
    return addTestcasesToPageAndTakeSnapshot({
      customSnapshotIdentifier: 'north-east-font-variation-test',
      testCases: testCases.fontVariations,
      testScope
    })
  })
})