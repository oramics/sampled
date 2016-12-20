const showdown = require('showdown')
const converter = new showdown.Converter()

const README = 'README.md'

module.exports = function (repo) {
  return function (files) {
    for (var name in files) {
      if (name.endsWith(README)) {
        const readme = repo.fileToStr(files[name])
        const path = name.slice(0, -README.length)
        files[path + 'index.html'] = repo.strToFile(toHTML('Sampled', readme))
      }
    }
  }
}

const toHTML = (title, md, style = 'modest') =>
`<!DOCTYPE html>
<html>
<title>${title}</title>
<meta charset="UTF-8">
<link rel="stylesheet" href="https://markdowncss.github.io/${style}/css/${style}.css">
<body>
  ${converter.makeHtml(md)}
</body>
</html>
`
