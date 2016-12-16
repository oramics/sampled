const Metalsmith = require('metalsmith')

/**
 * Traverse all files of the repository
 * @example
 * files((files) => {
 *   for (var name in files) {
 *      var content = files[name].content.toString()
 *   }
 * })
 */
module.exports = function files (name, cb) {
  Metalsmith(__dirname)
  .source('..')
  .destination('..')
  .clean(false)
  .frontmatter(false)
  .ignore(['.git', 'node_modules', 'build'])
  .use(cb)
  .build(function (err) {
    if (err) throw err
    console.log(`${name} finished!`)
  })
}
