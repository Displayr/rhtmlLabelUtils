/* global jest */
/* global expect */

const {
  pageInteractions: { executeReset },
  testSetup: { beforeAllFixtureFactory, afterAllFixtureFactory }
} = require('../utils')

describe('split into lines:', () => {
  let testScope = {}
  beforeAll(beforeAllFixtureFactory(testScope))
  afterAll(afterAllFixtureFactory(testScope))

  test('splitIntoLines', async () => {
    const { page } = testScope
    await executeReset({ page })

    function thisIsExecutedRemotely () {
      return window.executeSplintIntoLinesByWord({
        text: 'line 1 of output line 2 of output',
        fontSize: 12,
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
        maxWidth: 100,
        maxHeight: null,
      })
    }

    const output = await page.evaluate(thisIsExecutedRemotely)

    expect(output).toEqual([
      'line 1 of output',
      'line 2 of output',
    ])
  })
})
