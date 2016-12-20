const { getJSON, objToFile } = require('../utils')
const capitalize = require('to-capital-case')
const CONFIG = '/sampled.config.json'
const URL = 'https://danigb.github.io/sampled'
const GROUPS = {
  DM: 'Drum machine',
  IR: 'Impulse Response',
  DRUMS: 'Acoustic Drum'
}

module.exports = function () {
  return function (files) {
    for (var name in files) {
      if (name.endsWith(CONFIG)) {
        const meta = generateMetadata(name, files)
        const path = meta.url.slice(URL.length + 1)
        files[path + 'sampled.json'] = objToFile(meta)
      }
    }
  }
}

function generateMetadata (file, files) {
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
  data.type = GROUPS[group] || capitalize(group)
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
  data.files.sort()
  return data
}
