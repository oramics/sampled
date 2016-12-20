const showdown = require('showdown')
const converter = new showdown.Converter()
const Files = require('./files')
const { MD, getJSON, strToFile, objToFile } = require('./utils')
const capitalize = require('to-capital-case')
// const minimatch = require('minimatch')
const CONFIG = '/sampled.config.json'
const URL = 'https://danigb.github.io/sampled'

const GROUPS = {
  DM: 'Drum machine',
  IR: 'Impulse Response',
  DRUMS: 'Acoustic Drum'
}

Files('build', (files) => {
  const all = {}
  const groups = {}
  for (var file in files) {
    if (file.endsWith(CONFIG)) {
      const inst = buildInstrument(file, files)
      updateIndices(all, groups, inst)
      const path = inst.url.slice(URL.length)
      files[path + 'sampled.json'] = objToFile(inst)
      files[path + 'README.md'] = strToFile(instPage(inst))
      files[path + 'index.html'] = toHTML(inst.name, instPage(inst))
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
  const split = file.split('/')
  const path = split.slice(0, -1).join('/') + '/'
  const group = split[0]
  const parentName = split[split.length - 2]
  const config = getJSON(files[file])

  const data = {}
  data.name = data.name || parentName
  data.description = config.description
  data.license = config.license
  data.url = `${URL}/${path}`
  data.type = GROUPS[group].slice(0, -1)
  var samples = config.samples || 'samples/'
  data.samples = `${data.url}${samples}`
  data.files = []
  var pattern = `${path}${samples}`
  for (var sample in files) {
    if (sample.startsWith(pattern)) {
      const name = sample.slice(pattern.length)
      data.files.push(name)
    }
  }
  return data
}

function updateIndices (all, groups, inst) {
  const group = inst.url.slice(URL.length).split('/')[0]
  all[inst.name] = inst
  groups[group] = groups[group] || {}
  groups[group][inst.name] = inst
}

function instPage (meta) {
  const group = meta.url.slice(URL.length).split('/')[0]
  const HOME = MD()
  HOME.p(MD.a('Sampled', URL), '/', MD.a(`${meta.type}s`, `${URL}/${group}`))
  HOME.h1(meta.name)
  Object.keys(meta).forEach(function (key) {
    const val = meta[key]
    if (typeof val === 'string') HOME.lip(key, val)
  })
  HOME.linebreak()

  HOME.h3('Samples')

  meta.files.forEach(function (file) {
    const name = capitalize(file).slice(0, file.lastIndexOf('.'))
    HOME.lip(name, MD.a(file, `${meta.samples}${file}`))
  })
  HOME.p('\n\n\n')
  HOME.h3('Metadata')

  HOME.p(MD.a('sampled.json', `${meta.url}sampled.json`))

  HOME.code(JSON.stringify(meta, null, 2))

  return HOME.toString()
}

function homePage (groups) {
  var md = '\n'
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
