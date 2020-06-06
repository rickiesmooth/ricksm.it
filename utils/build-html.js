const fs = require('fs').promises
const gm = require('gray-matter')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { basename, extname } = require('path')

const md = require('markdown-it')({ html: true })
  .use(require('markdown-it-attrs'))
  .use(
    require('@toycode/markdown-it-class'),
    require('./markdown-it-class-mapping')
  )
const buildHtmlWithTemplate = (transformPathname) => (pathname) =>
  fs.readFile(pathname, 'utf-8').then((file) => {
    const { data, content } = gm(file)
    const { title, description, slug } = data
    const body = md.render(content)

    const scriptsMap = {
      index: 'home',
      work: 'work',
    }

    return [
      new HtmlWebPackPlugin({
        templateContent: body,
        inject: 'body',
        chunks: [scriptsMap[slug]],
        filename: `${transformPathname({
          pathname,
          slug,
          fileSuffix: '.partial',
        })}`,
      }),
      new HtmlWebPackPlugin({
        inject: false,
        template: 'src/html/template.hbs',
        filename: transformPathname({ pathname, slug }),
        chunks: ['main', scriptsMap[slug]],
        templateParameters: { body, title, description },
      }),
    ]
  })

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

exports.postsTemplate = buildHtmlWithTemplate((opts) =>
  getFilename({ ...opts, directoryPrefix: 'blog/' })
)

exports.pagesTemplate = buildHtmlWithTemplate(getFilename)

exports.buildBlogPage = (posts) => {
  const postlist = posts
    .map(
      ([
        _,
        {
          options: { filename, templateParameters },
        },
      ]) =>
        `<a href=/${filename.replace('index.html', '')}>${
          templateParameters.title
        }</a>`
    )
    .join('')
  const body = `<div class="flex flex-col">${postlist}</div>`
  return [
    new HtmlWebPackPlugin({
      templateContent: body,
      inject: false,
      filename: `blog/index.partial.html`,
    }),
    new HtmlWebPackPlugin({
      template: 'src/html/template.hbs',
      filename: `blog/index.html`,
      inject: false,
      templateParameters: {
        body,
        title: 'Blog',
        description: 'Blog posts',
      },
    }),
  ]
}

exports.shells = [
  new HtmlWebPackPlugin({
    template: 'src/html/shell-end.hbs',
    filename: 'shell-end.html',
    inject: false,
  }),
  new HtmlWebPackPlugin({
    template: 'src/html/shell-start.hbs',
    filename: 'shell-start.html',
    inject: false,
  }),
]
