const Metalsmith = require('metalsmith')
const metadata = require('./tasks/metadata')
const readme = require('./tasks/readme')
const html = require('./tasks/html')

const URL = 'https://oramics.github.io/sampled'
const fileToStr = (file) => file.contents.toString()
const fileToObj = (file) => file ? JSON.parse(fileToStr(file)) : null
const strToFile = (str) => ({ contents: new Buffer(str) })
const objToFile = (obj) => strToFile(JSON.stringify(obj, null, 2))

const repo = { fileToStr, fileToObj, strToFile, objToFile, URL }

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
 .use(metadata(repo))
 .use(readme(repo))
 .use(html(repo))
 .build(function (err) {
   if (err) throw err
   console.log(`Build finished!`)
 })
