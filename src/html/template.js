module.exports = (templateData) => {
  const { htmlWebpackPlugin } = templateData
  const { templateParameters } = htmlWebpackPlugin.options
  if (htmlWebpackPlugin.options.templateParameters.partial) {
    return `${htmlWebpackPlugin.options.templateParameters.body}
    ${htmlWebpackPlugin.files.js.map(
      (jsFile) => `<script>
      ${templateData.compilation.assets[
        jsFile.substr(htmlWebpackPlugin.files.publicPath.length)
      ].source()}</script>`
    )}
    `
  }

  return `
    ${require('./shell-start.ejs')(templateData)}
    <div id="content" class="${
      templateParameters.slug
    } md-container max-w-screen-md container mx-auto px-4 my-16">
      ${htmlWebpackPlugin.options.templateParameters.body}
    </div>
    ${require('./shell-end.ejs')(templateData)}
  `
}
