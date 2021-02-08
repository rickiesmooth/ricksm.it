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
  buildHtmlWithTemplate,
  buildBlogPage,
  shells,
} = require('./utils/build-html')

module.exports = async (_env, _argv) => {
  const pages = glob.sync('content/pages/*.md')
  const posts = glob.sync('content/blog/*.md').reverse()

  const [allPostsHtml, allPagesHtml] = await Promise.all([
    Promise.all(posts.map(buildHtmlWithTemplate)),
    Promise.all(pages.map(buildHtmlWithTemplate)),
  ])

  const blogPage = buildBlogPage(allPostsHtml)

  return {
    mode: process.env.NODE_ENV,
    entry: {
      main: './src/main.ts',
      home: './src/home.ts',
      work: './src/work.ts',
      blog: './src/blog.ts',
    },
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
          test: /\.ejs$/,
          loader: 'ejs-loader',
          options: {
            esModule: false,
          },
        },

        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
            'sass-loader',
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
      new CopyWebpackPlugin({
        patterns: [{ from: 'content/pages/admin', to: 'admin' }],
      }),
      new CopyWebpackPlugin({ patterns: [{ from: 'static' }] }),
      new workboxPlugin.InjectManifest({
        swSrc: './src/sw.ts',
      }),
    ],
  }
}
