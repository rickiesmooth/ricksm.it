'use strict'
const { normalizeGithubData } = require('./normalize')
const mockData = require('../../events/data.json')

describe('fetch-github/service/normalize', function () {
  it('should transforms github response', async () => {
    const { data } = normalizeGithubData(mockData)

    expect(data.showcaseItems).toStrictEqual([
      {
        name: 'home',
        url: 'https://github.com/rickiesmooth/home',
        descriptionHTML:
          '<div>React UI for <a href="https://github.com/mozilla-iot/gateway">https: //github.com/mozilla-iot/gateway</a>. </div>',
        topics: ['graphql'],
      },
    ])
  })
  it('should preserve github error', async () => {
    const result = normalizeGithubData({
      errors: ['one error', 'other error'],
    })

    expect(result.errors).toStrictEqual(['one error', 'other error'])
  })
})
