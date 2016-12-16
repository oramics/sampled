const showdown = require('showdown')
const converter = new showdown.Converter()
const Files = require('./files')
const { MD, getJSON, strToFile, objToFile } = require('./utils')
const capitalize = require('to-capital-case')
// const minimatch = require('minimatch')
const CONFIG = '/sampled.config.json'
const URL = 'https://danigb.github.io/sampled'

const GROUPS = {
  DM: 'Drum machines',
  IR: 'Impulse Responses',
  DRUMS: 'Acoustic Drums'
}

Files('build', (files) => {
  const all = {}
  const groups = {}
  for (var file in files) {
    if (file.endsWith(CONFIG)) {
      const inst = buildInstrument(file, files)
      inst.meta = createMetadata(inst, files)
      files[inst.path + 'sampled.json'] = objToFile(inst.meta)
      updateIndices(all, groups, inst)
      files[inst.path + 'README.md'] = strToFile(instPage(inst))
      files[inst.path + 'index.html'] = toHTML(inst.name, instPage(inst))
    }
  }
  files['instruments.json'] = objToFile(all)
  Object.keys(groups).forEach(function (group) {
    files[`${group}/instruments.js`] = objToFile(groups[group])
    files[`${group}/README.md`] = strToFile(groupPage(group, groups[group]))
    files[`${group}/index.html`] = toHTML(GROUPS[group], groupPage(group, groups[group]))
  })
  files['index.html'] = toHTML('Sampled', homePage(groups))
  console.log(Object.keys(all))
})

function buildInstrument (file, files) {
  const path = file.split('/')
  return {
    group: path[0],
    path: path.slice(0, -1).join('/') + '/',
    dir: path[path.length - 2],
    file: file,
    config: getJSON(files[file])
  }
}

function createMetadata (instrument, files) {
  const { dir, group, config, path } = instrument
  const data = Object.assign({}, config)
  data.name = data.name || dir
  data.path = instrument.path
  data.url = `${URL}/${data.path}`
  data.type = GROUPS[group].slice(0, -1)
  data.files = {}
  data.samples = data.samples || 'samples/'
  data.samplesURL = `${data.url}${data.samples}`
  var pattern = `${path}${data.samples}`
  for (var file in files) {
    if (file.startsWith(pattern)) {
      const name = file.slice(pattern.length)
      const key = capitalize(name.slice(0, name.lastIndexOf('.')))
      data.files[key] = name
    }
  }
  return data
}

function instSummary (inst) {
  return {
    name: inst.meta.name,
    description: inst.meta.description,
    type: inst.meta.type,
    url: inst.meta.url
  }
}

function updateIndices (all, groups, inst) {
  const summary = instSummary(inst)
  all[inst.meta.name] = summary
  groups[inst.group] = groups[inst.group] || {}
  groups[inst.group][inst.meta.name] = summary
}

function instPage (instrument) {
  const { group, meta } = instrument
  const HOME = MD()
  HOME.p(MD.a('Sampled', URL), '/', MD.a(`${meta.type}s`, `${URL}/${group}`))
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
  HOME.p('\n\n\n')
  HOME.h3('Metadata')

  HOME.p(MD.a('sampled.json', `${meta.url}sampled.json`))

  HOME.code(JSON.stringify(meta, null, 2))

  return HOME.toString()
}

function homePage (groups) {
  var md = '# Sampled\n\n\n'
  Object.keys(groups).forEach(function (group) {
    md += groupPage(group, groups[group])
  })
  return md
}

function groupPage (id, group) {
  const TOC = MD().h2(GROUPS[id])
  var dataUrl = `${URL}/${id}/instruments.json`
  TOC.p(MD.a(dataUrl, dataUrl))
  Object.keys(group).forEach(function (name) {
    var meta = group[name]
    TOC.lip(MD.a(meta.name, meta.url), meta.description)
  })
  return TOC.toString()
}

// const STYLES = ['modest', 'retro', 'air']
function toHTML (title, md, style = 'modest') {
  return strToFile(`<!DOCTYPE html>
  <html>
  <title>${title}</title>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://markdowncss.github.io/${style}/css/${style}.css">
  <body>
    ${converter.makeHtml(md)}
  </body>
  </html>
  `)
}
