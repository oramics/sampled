var Metalsmith = require('metalsmith')
var toSnake = require('to-snake-case')
var minimatch = require('minimatch')

var dir = './Voxengo'

Metalsmith(__dirname)
  .source(dir)
  .destination(dir)
  .clean(false)
  .frontmatter(false)
  .use(rename())
  .build(function (err) {
    if (err) throw err
    console.log('Build finished!')
  })

function rename () {
  return function (files) {
    for (var file in files) {
      if (minimatch(file, '*.wav')) {
        var content = files[file]
        var filename = toSnake(file)
        var last = filename.lastIndexOf('_')
        filename = filename.slice(0, last) + '.wav'
        console.log('joder', file, filename)
        delete files[file]
        files[filename] = content
      }
    }
  }
}
