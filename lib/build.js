const Metalsmith = require('metalsmith')
const join = require('path').join
const { MD, getJSON, strToFile } = require('./utils')
// const minimatch = require('minimatch')
const ignore = require('metalsmith-ignore')

const CONFIG = '/sampled.config.json'
const URL = 'https://danigb.github.io/sampled'

run('Drum machines', 'DM')
run('Impulse Responses', 'IR')
run('Acoustic Drums', 'DRUMS')

function run (group, dir) {
  Metalsmith(join(__dirname, '..'))
    .source(dir)
    .destination(dir)
    .clean(false)
    .frontmatter(false)
    .use(ignore(['node_modules/*', '.git/*']))
    .use(buildGroup(group, dir))
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
  TOC.lip(MD.a(data.name || instName, url), data.description)
}

function inst (group, instName, data, files) {
  const HOME = MD()
  HOME.h3(group.name)
  HOME.h1(data.name || instName)
  HOME.p(MD.i(data.description))
  HOME.lip('url', `${URL}/${group.dir}/${instName}`)
  const dest = `${instName}/index.md`
  store(dest, files, strToFile(HOME.toString()))
}

function buildGroup (groupName, dir) {
  var TOC = MD().h1(groupName)
  return function (files) {
    for (var file in files) {
      if (file.endsWith(CONFIG)) {
        const group = { name: groupName, dir }
        const instName = file.slice(0, -CONFIG.length)
        const data = getJSON(files[file])
        toc(TOC, group, instName, data)
        inst(group, instName, data, files)
      }
    }
    files['index.md'] = strToFile(TOC.toString())
    console.log(TOC.toString())
  }
}
