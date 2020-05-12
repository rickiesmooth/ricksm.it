const devMode = process.env.NODE_ENV !== 'production'

const glob = require('glob')
const { join } = require('path')

const TerserJSPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

const { buildHtmlWithTemplate } = require('./utils/build-html-with-template')

module.exports = async (_env, _argv) => {
  const pages = glob.sync('content/pages/*.md')
  const posts = glob.sync('content/blog/*.md')

  const baseConfig = {
    mode: process.env.NODE_ENV,
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
    },
    output: {
      path: join(__dirname, 'build'),
      publicPath: '/',
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
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode
          ? 'assets/css/[name].css'
          : 'assets/css/[name].[hash].css',
      }),
    ],
  }

  const allHtml = await Promise.all(
    process.env.BLOG
      ? posts.map(buildHtmlWithTemplate('src/html/template.html'))
      : pages.map(buildHtmlWithTemplate('src/html/template.html'))
  )

  return process.env.BLOG
    ? {
        ...baseConfig,
        entry: { main: './src/index.scss' },
        plugins: baseConfig.plugins.concat(allHtml),
      }
    : {
        ...baseConfig,
        entry: { main: './src/index.tsx' },
        output: {
          ...baseConfig.output,
          filename: 'assets/js/[name]-[hash].js',
        },
        optimization: {
          minimizer: baseConfig.optimization.minimizer.concat(
            new TerserJSPlugin({})
          ),
        },
        module: {
          rules: baseConfig.module.rules.concat({
            test: /\.tsx?$/,
            loader: 'babel-loader',
          }),
        },
        plugins: baseConfig.plugins.concat(
          ...allHtml,
          new webpack.DefinePlugin({
            'process.env': {
              API_URL: JSON.stringify(process.env.API_URL),
            },
          }),
          new CopyWebpackPlugin([
            { from: 'content/pages/admin/index.html', to: 'admin.html' },
            { from: 'content/pages/admin/config.yml', to: 'config.yml' },
          ])
        ),
      }
}
