module.exports = (templateData) => {
  const { htmlWebpackPlugin } = templateData
  const { templateParameters } = htmlWebpackPlugin.options

  if (htmlWebpackPlugin.options.templateParameters.partial) {
    return `${htmlWebpackPlugin.options.templateParameters.body}
    ${htmlWebpackPlugin.files.js
      .map(
        (jsFile) => `<script>
      ${templateData.compilation.assets[
        jsFile.substr(htmlWebpackPlugin.files.publicPath.length)
      ].source()}</script>`
      )
      .join('')}
    <script>document.getElementById('content').setAttribute('data-route', '${
      templateParameters.slug
    }')</script>
    `
  }

  return `
    ${require('./shell-start.ejs')(templateData)}
    <main id="content" class="md-container max-w-screen-md container mx-auto px-4 my-16" data-route="${
      templateParameters.slug
    }">
      ${htmlWebpackPlugin.options.templateParameters.body}
    </main>
    ${require('./shell-end.ejs')(templateData)}
  `
}
