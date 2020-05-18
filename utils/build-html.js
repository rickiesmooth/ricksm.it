const fs = require('fs').promises
const gm = require('gray-matter')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const md = require('markdown-it')({ html: true })
  .use(require('markdown-it-attrs'))
  .use(
    require('@toycode/markdown-it-class'),
    require('./markdown-it-class-mapping')
  )

exports.buildHtmlWithTemplate = (transformPathname, excludeChunks) => (
  pathname
) =>
  fs.readFile(pathname, 'utf-8').then((file) => {
    const { data, content } = gm(file)
    const { title, description, slug } = data
    const body = md.render(content)

    return new HtmlWebPackPlugin({
      template: 'src/html/templatePages.html',
      filename: transformPathname(pathname, slug),
      templateParameters: { body, title, description },
      excludeChunks,
    })
  })

exports.buildBlogPage = (posts) =>
  new HtmlWebPackPlugin({
    template: 'src/html/templatePages.html',
    filename: `blog.html`,
    excludeChunks: ['main'],
    templateParameters: {
      body: `<div class="flex flex-col">${posts
        .map(
          ({
            options: {
              filename,
              templateParameters: { title },
            },
          }) => `<a href=${filename.replace('index.html', '')}>${title}</a>`
        )
        .join('')}</div>`,
      title: 'Blog',
      description: 'Blog posts',
    },
  })
