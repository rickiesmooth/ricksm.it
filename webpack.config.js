const devMode = process.env.NODE_ENV !== 'production'

const glob = require('glob')
const { join } = require('path')

const TerserJSPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

const { buildHtmlWithTemplate, buildBlogPage } = require('./utils/build-html')

module.exports = async (_env, _argv) => {
  const pages = glob.sync('content/pages/*.md')
  const posts = glob.sync('content/blog/*.md')
  const postsTemplate = buildHtmlWithTemplate('src/html/templatePages.html')
  const pagesTemplate = buildHtmlWithTemplate('src/html/templatePosts.html')

  const [allBlogHtml, allPagesHtml] = await Promise.all([
    Promise.all(posts.map(postsTemplate)),
    Promise.all(pages.map(pagesTemplate)),
  ])

  const blogPage = buildBlogPage(allBlogHtml)

  return {
    mode: process.env.NODE_ENV,
    entry: { main: './src/index.tsx' },
    output: {
      path: join(__dirname, 'build'),
      publicPath: '/',
      filename: 'assets/js/[name]-[hash].js',
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        },
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
        },
      ],
    },
    plugins: [
      ...allBlogHtml,
      ...allPagesHtml,
      blogPage,
      new MiniCssExtractPlugin({
        filename: devMode
          ? 'assets/css/[name].css'
          : 'assets/css/[name].[hash].css',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          API_URL: JSON.stringify(process.env.API_URL),
        },
      }),
      new CopyWebpackPlugin([
        { from: 'content/pages/admin/index.html', to: 'admin.html' },
        { from: 'content/pages/admin/config.yml', to: 'config.yml' },
      ]),
    ],
  }
}
