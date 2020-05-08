const glob = require('glob')
const { basename, extname, join } = require('path')
const fs = require('fs').promises
const gm = require('gray-matter')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const md = require('markdown-it')().use(require('markdown-it-attrs'))

const makeHtmlWithTemplate = (template) => (pathname) =>
  fs.readFile(pathname, 'utf-8').then((file) => {
    const { data, content } = gm(file)
    const { title, description, slug } = data
    const body = md.render(content)

    return new HtmlWebPackPlugin({
      template,
      filename: `${slug || basename(pathname, extname(pathname))}.html`,
      templateParameters: { body, title, description },
    })
  })

module.exports = async (_env, _argv) => {
  const pages = glob.sync('content/pages/*.md')
  const posts = glob.sync('content/blog/*.md')

  const allHtml = await Promise.all([
    ...pages.map(makeHtmlWithTemplate('src/html/template.html')),
    ...posts.map(makeHtmlWithTemplate('src/html/template.html')),
  ])

  return {
    entry: { main: './src/index.tsx' },
    output: {
      path: join(__dirname, 'build'),
      publicPath: '/',
      filename: '[name]-[hash].js',
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: 'babel-loader' }],
    },
    plugins: [...allHtml],
  }
}
