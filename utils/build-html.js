const { basename, extname } = require('path')
const fs = require('fs').promises
const gm = require('gray-matter')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const md = require('markdown-it')({ html: true })
  .use(require('markdown-it-attrs'))
  .use(
    require('@toycode/markdown-it-class'),
    require('./markdown-it-class-mapping')
  )

exports.buildHtmlWithTemplate = (template) => (pathname) =>
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

exports.buildBlogPage = (posts) =>
  new HtmlWebPackPlugin({
    template: 'src/html/templatePages.html',
    filename: `blog.html`,
    templateParameters: {
      body: `<div class="flex flex-col">${posts
        .map(
          ({
            options: {
              filename,
              templateParameters: { title },
            },
          }) => `<a href=${filename.replace('.html', '')}>${title}</a>`
        )
        .join('')}</div>`,
      title: 'Blog',
      description: 'Blog posts',
    },
  })
