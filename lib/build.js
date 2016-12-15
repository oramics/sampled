const Metalsmith = require('metalsmith')
const join = require('path').join
const { MD, getJSON, strToFile } = require('./utils')
// const minimatch = require('minimatch')
const ignore = require('metalsmith-ignore')
const URL = 'https://danigb.github.io/sampled'

run('Drum machines', 'DM')

function run (group, dir) {
  Metalsmith(join(__dirname, '..'))
    .source(dir)
    .destination(dir)
    .clean(false)
    .frontmatter(false)
    .use(ignore(['node_modules/*', '.git/*']))
    .use(instrument(group, dir))
    .build(function (err) {
      if (err) throw err
      console.log(dir, 'Build finished!')
    })
}

function store (name, files, file, dump) {
  if (name) {
    files[name] = file
    console.log('Stored: ' + name)
  }
}

function toc (TOC, group, instName, data) {
  const url = `${URL}/${group.dir}/${instName}`
  TOC.lip(MD.a(data.name, url), data.description)
}

function inst (group, name, data, files) {
  const HOME = MD()
  HOME.h3(group.name)
  HOME.h1(data.name)
  HOME.p(MD.i(data.description))
  HOME.lip('url', `${URL}/${group.dir}/${name}`)
  const dest = `${name}/index.md`
  store(dest, files, strToFile(HOME.toString()))
}

function instrument (groupName, dir) {
  var TOC = MD().h1(groupName)
  return function (files) {
    for (var file in files) {
      if (file.match(/instrument\.json$/)) {
        const group = { name: groupName, dir }
        const instName = file.slice(0, -'/instrument.json'.length)
        const data = getJSON(files[file])
        toc(TOC, group, instName, data)
        inst(group, instName, data, files)
      }
    }
    files['index.md'] = strToFile(TOC.toString())
    console.log(TOC.toString())
  }
}
