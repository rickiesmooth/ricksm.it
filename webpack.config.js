const devMode = process.env.NODE_ENV !== 'production'

const glob = require('glob')
const { join, resolve } = require('path')

const TerserJSPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')
const workboxPlugin = require('workbox-webpack-plugin')

const {
  pagesTemplate,
  postsTemplate,
  buildBlogPage,
  shells,
} = require('./utils/build-html')

module.exports = async (_env, _argv) => {
  const pages = glob.sync('content/pages/*.md')
  const posts = glob.sync('content/blog/*.md')

  const [allPostsHtml, allPagesHtml] = await Promise.all([
    Promise.all(posts.map(postsTemplate)),
    Promise.all(pages.map(pagesTemplate)),
  ])

  const blogPage = buildBlogPage(allPostsHtml)

  return {
    mode: process.env.NODE_ENV,
    entry: { main: './src/index.ts' },
    output: {
      path: join(__dirname, 'build'),
      publicPath: '/',
      filename: 'assets/js/[name]-[hash].js',
    },
    resolve: {
      alias: { '@packages': resolve(__dirname, 'packages') },
      extensions: ['.ts', '.tsx', '.js'],
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    module: {
      rules: [
        {
          test: /\.hbs$/,
          use: [{ loader: 'handlebars-loader' }],
        },
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
      ...[...allPostsHtml, ...allPagesHtml, ...blogPage].flat(),
      ...shells,
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
      new CopyWebpackPlugin([{ from: 'content/pages/admin', to: 'admin' }]),
      new CopyWebpackPlugin([{ from: 'static' }]),
      new workboxPlugin.InjectManifest({
        swSrc: './src/sw.ts',
      }),
    ],
  }
}
