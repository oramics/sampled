const Metalsmith = require('metalsmith')
const join = require('path').join
const { MD, getJSON, strToFile, objToFile } = require('./utils')
const capitalize = require('to-capital-case')
// const minimatch = require('minimatch')
const ignore = require('metalsmith-ignore')
const is = (t, o) => typeof o === t
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

function store (name, files, contents, dump) {
  if (name) {
    const file = is('string', contents) ? strToFile(contents) : objToFile(contents)
    files[name] = file
    console.log('Stored: ' + name)
  }
}

function groupTOC (TOC, instrument, files) {
  const { meta } = instrument
  TOC.lip(MD.a(meta.name, meta.url), meta.description)
}

function instIndex (instrument, files) {
  const { dir, group, meta } = instrument
  const HOME = MD()
  HOME.p(MD.a('Sampled', URL), '/', MD.a(group.name, `${URL}/${group.dir}`))
  HOME.h1(meta.name)
  Object.keys(meta).forEach(function (key) {
    const val = meta[key]
    if (typeof val === 'string') HOME.lip(key, val)
  })
  HOME.linebreak()

  HOME.h3('Samples')

  Object.keys(meta.files).forEach(function (name) {
    const file = meta.files[name]
    HOME.lip(name, MD.a(file, `${meta.url}${meta.samples}${file}`))
  })

  HOME.h3('Metadata')

  HOME.code(JSON.stringify(meta, null, 2))

  const dest = `${dir}/index.md`
  store(dest, files, HOME.toString())
}

function createMetadata (instrument, files) {
  const { dir, group, config } = instrument
  const data = Object.assign({}, config)
  data.name = data.name || dir
  data.path = `${group.dir}/${dir}/`
  data.url = `${URL}/${data.path}`
  data.type = group.name.slice(0, -1)
  data.files = {}
  data.samples = data.samples || 'samples/'
  var pattern = `${dir}/${data.samples}`
  for (var file in files) {
    if (file.startsWith(pattern)) {
      const name = file.slice(pattern.length)
      const key = capitalize(name.slice(0, name.lastIndexOf('.')))
      data.files[key] = name
    }
  }
  return data
}

function buildGroup (groupName, dir) {
  var TOC = MD().h1(groupName)
  const group = { name: groupName, dir }
  return function (files) {
    for (var file in files) {
      if (file.endsWith(CONFIG)) {
        const dir = file.slice(0, -CONFIG.length)
        const config = getJSON(files[file])
        const instrument = { dir, group, config }
        instrument.meta = createMetadata(instrument, files)
        store(`${dir}/sampled.json`, files, instrument.meta)
        groupTOC(TOC, instrument)
        instIndex(instrument, files)
      }
    }
    files['index.md'] = strToFile(TOC.toString())
    console.log(TOC.toString())
  }
}
