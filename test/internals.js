const assert = require('assert').strict
const GhostInspector = require('../index')('xxx')
const params = {
  a: 1,
  b: true,
  c: 'c',
  d: ['x', 'y', 'z']
}

describe('buildRequestUrl()', function () {
  it('should create an absolute API URL', async () => {
    const url = await GhostInspector.buildRequestUrl('/suites/')
    assert.strictEqual(url, 'https://api.ghostinspector.com/v1/suites/')
  })
})

describe('buildQueryString()', function () {
  it('should create a query string from a parameters object', async () => {
    const queryString = await GhostInspector.buildQueryString(params)
    assert.strictEqual(queryString, '?a=1&b=true&c=c&d[]=x&d[]=y&d[]=z&')
  })
})

describe('buildFormData()', function () {
  it('should create a formData object from a parameters object', async () => {
    const formData = await GhostInspector.buildFormData(params)
    assert.deepStrictEqual(formData, {
      a: '1',
      b: 'true',
      c: 'c',
      d: ['x', 'y', 'z']
    })
  })
})

describe('getOverallResultOutcome()', function () {
  it('should return true for a single passing result', async () => {
    const passing = await GhostInspector.getOverallResultOutcome({ passing: true })
    assert.strictEqual(passing, true)
  })
  it('should return false for a single failing result', async () => {
    const passing = await GhostInspector.getOverallResultOutcome({ passing: false })
    assert.strictEqual(passing, false)
  })
  it('should return null for a single unknown status result', async () => {
    const passing = await GhostInspector.getOverallResultOutcome({ passing: null })
    assert.strictEqual(passing, null)
  })
  it('should return null for a single result without a passing field', async () => {
    const passing = await GhostInspector.getOverallResultOutcome({ })
    assert.strictEqual(passing, null)
  })
  it('should return true for multiple results all passing', async () => {
    const passing = await GhostInspector.getOverallResultOutcome([{ passing: true }, { passing: true }])
    assert.strictEqual(passing, true)
  })
  it('should return false for multiple results all failing', async () => {
    const passing = await GhostInspector.getOverallResultOutcome([{ passing: false }, { passing: false }])
    assert.strictEqual(passing, false)
  })
  it('should return false for multiple results some failing', async () => {
    const passing = await GhostInspector.getOverallResultOutcome([{ passing: false }, { passing: true }])
    assert.strictEqual(passing, false)
  })
  it('should return null for multiple results some unknown', async () => {
    const passing = await GhostInspector.getOverallResultOutcome([{ passing: true }, { passing: null }])
    assert.strictEqual(passing, null)
  })
  it('should return null for empty results array', async () => {
    const passing = await GhostInspector.getOverallResultOutcome([])
    assert.strictEqual(passing, null)
  })
})
