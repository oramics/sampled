const capitalize = require('to-capital-case')
const CONFIG = '/sampled.config.json'
const GROUPS = {
  DM: 'Drum machine',
  IR: 'Impulse Response',
  DRUMS: 'Acoustic Drum'
}

module.exports = function (repo) {
  return function (files) {
    for (var name in files) {
      if (name.endsWith(CONFIG)) {
        const config = repo.fileToObj(files[name])
        const meta = generateMetadata(config, name, files, repo.URL)
        const path = meta.url.slice(repo.URL.length + 1)
        files[path + 'sampled.json'] = repo.objToFile(meta)
      }
    }
  }
}

function generateMetadata (config, name, files, URL) {
  const split = name.split('/')
  const path = split.slice(0, -1).join('/') + '/'
  const group = split[0]
  const parentName = split[split.length - 2]

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
