const glob = require('glob')
const path = require('path')
const fs = require('fs').promises
const fm = require('front-matter')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const markdownItAttrs = require('markdown-it-attrs')
const md = require('markdown-it')().use(markdownItAttrs)

module.exports = async (env, argv) => {
  const content = glob.sync('content/pages/*.md')
  const html = await Promise.all(
    content.map(async (path) => [path, await fs.readFile(path, 'utf-8')])
  )
  const pages = html.map(([filename, file]) => {
    const {
      attributes: { title, description, slug },
      body,
    } = fm(file)

    return new HtmlWebPackPlugin({
      template: 'src/html/template.html',
      filename:
        (slug || path.basename(filename, path.extname(filename))) + '.html',
      templateParameters() {
        return { body: md.render(body), title, description }
      },
    })
  })

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
