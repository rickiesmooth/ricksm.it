const devMode = process.env.NODE_ENV !== 'production'

const glob = require('glob')
const { basename, extname, join } = require('path')
const fs = require('fs').promises
const gm = require('gray-matter')

const md = require('markdown-it')()
  .use(require('markdown-it-attrs'))
  .use(
    require('@toycode/markdown-it-class'),
    require('./utils/markdown-it-class-mapping')
  )

const HtmlWebPackPlugin = require('html-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

module.exports = async (_env, _argv) => {
  const pages = glob.sync('content/pages/*.md')
  const posts = glob.sync('content/blog/*.md')

  const makeHtmlWithTemplate = (template) => (pathname) =>
    fs.readFile(pathname, 'utf-8').then((file) => {
      const { data, content } = gm(file)
      const { title, description, slug } = data
      const body = md.render(content)
      const templateParameters = {
        body,
        title,
        description,
      }

      return new HtmlWebPackPlugin({
        template,
        filename: `${slug || basename(pathname, extname(pathname))}.html`,
        templateParameters,
      })
    })

  const allHtml = await Promise.all([
    ...pages.map(makeHtmlWithTemplate('src/html/template.html')),
    ...posts.map(makeHtmlWithTemplate('src/html/template.html')),
  ])

  return {
    mode: process.env.NODE_ENV,
    entry: { main: './src/index.tsx' },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    output: {
      path: join(__dirname, 'build'),
      publicPath: '/',
      filename: '[name]-[hash].js',
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'babel-loader' },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          API_URL: JSON.stringify(process.env.API_URL),
        },
      }),
      new CopyWebpackPlugin([{ from: 'content/pages/admin', to: 'admin' }]),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
      }),
      ...allHtml,
    ],
  }
}
