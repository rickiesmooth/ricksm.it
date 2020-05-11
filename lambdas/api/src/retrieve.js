const https = require('https')

const githubOptions = {
  hostname: 'api.github.com',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'node',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
}

const query = JSON.stringify({
  query: `
    {
      viewer {
        itemShowcase {
          items(first:5) {
            edges {
              node {
                ... on Repository {
                  name
                  url
                  descriptionHTML
                  repositoryTopics(first: 8) {
                    edges { node { topic { name } } }
                  }
                }
              }
            }
          }
        }
      }
    }`,
})

exports.fetchGithubData = (callback) => {
  if (!process.env.GITHUB_TOKEN) {
    return { errors: 'No GitHub API key provided' }
  }
  const acceptedTypes = { ['application/json; charset=utf-8']: JSON.parse }
  const req = https.request(githubOptions, (res) => {
    const chunks = []
    res.on('data', (data) => chunks.push(data))
    res.on('end', () => {
      const accepted = acceptedTypes[res.headers['content-type']]
      if (accepted) {
        callback(accepted(Buffer.concat(chunks)))
      }
    })
  })

  req.on('error', (errors) => {
    console.log('ERRORS', errors)
  })
  req.write(query)
  req.end()
}
