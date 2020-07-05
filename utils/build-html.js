const fs = require('fs').promises
const gm = require('gray-matter')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { basename, extname } = require('path')

const md = require('markdown-it')({ html: true }).use(
  require('@toycode/markdown-it-class'),
  require('./markdown-it-class-mapping')
)
exports.buildHtmlWithTemplate = ({ directoryPrefix } = {}) => (pathname) =>
  fs.readFile(pathname, 'utf-8').then((file) => {
    const { data, content } = gm(file)
    const { title, description, slug } = data
    const body = md.render(content)

    const scriptsMap = {
      index: 'home',
      work: 'work',
    }

    return generatePageAndPartialHtml({
      pathname,
      title,
      slug,
      description,
      body,
      chunks: [scriptsMap[slug]],
      directoryPrefix,
    })
  })

exports.buildBlogPage = (posts) => {
  const postlist = posts
    .map(
      ([
        _,
        {
          options: { filename, templateParameters },
        },
      ]) =>
        `<a href=/${filename.replace(
          'index.html',
          ''
        )}><h4 class="leading-snug text-md font-semibold sm:text-lg">${
          templateParameters.title
        }</h4></a>`
    )
    .join('')
  const body = `<div class="flex flex-col">${postlist}</div>`

  return generatePageAndPartialHtml({
    pathname: 'blog',
    title: 'Blog',
    slug: 'blog',
    description: 'Blog posts',
    body,
  })
}

exports.shells = [
  new HtmlWebpackPlugin({
    template: 'src/html/shell-end.ejs',
    filename: 'shell-end.html',
    inject: false,
  }),
  new HtmlWebpackPlugin({
    template: 'src/html/shell-start.ejs',
    filename: 'shell-start.html',
    inject: false,
  }),
]

function generatePageAndPartialHtml({
  body,
  pathname,
  slug,
  title,
  description,
  chunks = [],
  directoryPrefix,
}) {
  return [
    new HtmlWebpackPlugin({
      template: 'src/html/template.js',
      inject: false,
      chunks,
      filename: getFilename({
        pathname,
        slug,
        fileSuffix: '.partial',
        directoryPrefix,
      }),
      templateParameters: { body, slug, partial: true },
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/template.js',
      inject: false,
      chunks: ['main', ...chunks],
      filename: getFilename({
        pathname,
        slug,
        directoryPrefix,
      }),
      templateParameters: {
        body,
        slug,
        title,
        description,
      },
    }),
  ]
}

const getFilename = ({
  pathname,
  slug,
  fileSuffix = '',
  directoryPrefix = '',
}) =>
  slug === 'index'
    ? `index${fileSuffix}.html`
    : `${directoryPrefix}${
        slug || basename(pathname, extname(pathname))
      }/index${fileSuffix}.html`
