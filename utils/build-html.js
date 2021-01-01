const fs = require('fs').promises
const gm = require('gray-matter')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { basename, extname } = require('path')

const md = require('markdown-it')({ html: true }).use(
  require('@toycode/markdown-it-class'),
  require('./markdown-it-class-mapping')
)
exports.buildHtmlWithTemplate = (pathname) =>
  fs.readFile(pathname, 'utf-8').then((file) => {
    const { data, content } = gm(file)
    const body = md.render(content)
    const isPost = data.layout === 'blog'
    const script = {
      index: 'home',
      work: 'work',
    }[data.slug]

    const chunks = []

    if (script) chunks.push(script)
    if (isPost) chunks.push('blog')

    return generatePageAndPartialHtml({
      pathname,
      body,
      chunks,
      isPost,
      data,
      ...(isPost && { directoryPrefix: 'blog/' }),
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
    data: {
      title: 'Blog',
      slug: 'blog',
      description: 'Blog posts',
    },
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

const generatePageAndPartialHtml = ({
  pathname,
  chunks = [],
  isPost = false,
  directoryPrefix,
  data,
  body,
}) => {
  console.log('chunks', chunks)
  return [
    new HtmlWebpackPlugin({
      template: 'src/html/template.js',
      inject: false,
      chunks,
      filename: getFilename({
        pathname,
        slug: data.slug,
        fileSuffix: '.partial',
        directoryPrefix,
      }),
      templateParameters: { ...data, body, isPost, partial: true },
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/template.js',
      inject: false,
      chunks: ['main', ...chunks],
      filename: getFilename({
        pathname,
        slug: data.slug,
        directoryPrefix,
      }),
      templateParameters: { ...data, body, isPost },
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
