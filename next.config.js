module.exports = {
  images: {
    domains: [
      'pbs.twimg.com', // Twitter Profile Picture
    ],
  },
  redirects() {
    return [
      {
        source: '/blog/:slug',
        destination: '/posts/:slug', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
}
