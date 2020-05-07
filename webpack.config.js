const glob = require('glob')
const path = require('path')
const fs = require('fs').promises
const gm = require('gray-matter')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const md = require('markdown-it')().use(require('markdown-it-attrs'))

function generatePages([pathname, file]) {
  const {
    data: { title, description, slug },
    content,
  } = gm(file)
  const filename = path.basename(pathname, path.extname(pathname))

  return new HtmlWebPackPlugin({
    template: 'src/html/template.html',
    filename: (slug || filename) + '.html',
    templateParameters() {
      return { body: md.render(content), title, description }
    },
  })
}

module.exports = async (env, argv) => {
  const pagesPaths = glob.sync('content/pages/*.md')
  const htmlPages = await Promise.all(
    pagesPaths.map(async (path) => [path, await fs.readFile(path, 'utf-8')])
  )
  const pages = htmlPages.map(generatePages)

  return {
    entry: {
      main: './src/index.tsx',
    },
    output: {
      path: path.join(__dirname, 'build'),
      publicPath: '/',
      filename: '[name].js',
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: 'babel-loader' }],
    },
    plugins: [...pages],
  }
}
