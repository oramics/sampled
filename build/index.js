const Metalsmith = require('metalsmith')
const metadata = require('./tasks/metadata')

/**
 * Traverse all files of the repository
 * @example
 * files((files) => {
 *   for (var name in files) {
 *      var content = files[name].content.toString()
 *   }
 * })
 */
Metalsmith(__dirname)
 .source('..')
 .destination('..')
 .clean(false)
 .frontmatter(false)
 .ignore(['.git', 'node_modules', 'build'])
 .use(metadata())
 .build(function (err) {
   if (err) throw err
   console.log(`Build finished!`)
 })
