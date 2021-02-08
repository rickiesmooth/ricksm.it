const map = require('../../utils/markdown-it-class-mapping')

module.exports = (templateData) => {
  const { htmlWebpackPlugin } = templateData
  const { templateParameters } = htmlWebpackPlugin.options

  if (htmlWebpackPlugin.options.templateParameters.partial) {
    return `${templateParameters.body}
    ${htmlWebpackPlugin.files.js
      .map(
        (jsFile) => `<script>
      ${templateData.compilation.assets[
        jsFile.substr(htmlWebpackPlugin.files.publicPath.length)
      ].source()}</script>`
      )
      .join('')}
    <script>
    document.getElementById('content').setAttribute('data-route', '${
      templateParameters.slug || 'post'
    }')
    document.title = '${templateParameters.title}'
    </script>
    `
  }

  function getBody() {
    if (templateParameters.isPost) {
      const classes = map['h1'].join(' ')
      const date = new Date(templateParameters.date).toLocaleString()
      return `
      <div class="markdown-body">
        <p>Published on ${date}<p>
        <a href="/blog/">back</a>
        <h1 class="${classes}">${templateParameters.title}</h1>
        ${templateParameters.body}
      </div>
      `
    }
    return `${templateParameters.body}`
  }

  return `
    ${require('./shell-start.ejs')(templateData)}
    <main id="content" class="md-container max-w-screen-md container mx-auto px-4 my-16" data-route="${
      templateParameters.slug || 'post'
    }">
      
      ${getBody()}
    </main>
    ${require('./shell-end.ejs')(templateData)}
  `
}
