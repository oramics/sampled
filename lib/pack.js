var Metalsmith = require('metalsmith')
var toCapital = require('to-capital-case')

var minimatch = require('minimatch')

run('./IR/Voxengo')
run('./IR/EMT140-Plate')

function run (dir) {
  Metalsmith(__dirname)
    .source(dir)
    .destination(dir)
    .clean(false)
    .frontmatter(false)
    .use(meta())
    .use(readme())
    .build(function (err) {
      if (err) throw err
      console.log(dir, 'Build finished!')
    })
}

var PROPS = ['name', 'type', 'description', 'url', 'source', 'license']
function meta () {
  return function (files) {
    console.log('Building pack.json file')
    var key
    var inst = parseJSON(files['instrument.json'])
    var meta = { }
    PROPS.forEach(function (prop) {
      meta[prop] = inst[prop]
    })
    meta.files = {}
    for (var file in files) {
      var base = inst.samples
      if (minimatch(file, base + '*')) {
        key = toCapital(file.slice(base.length, file.lastIndexOf('.')))
        meta.files[key] = file
      }
    }
    console.log(meta)
    files['sampled.json'] = fromJSON(meta)
  }
}

function readme () {
  return function (files) {
    var samples = {}
    var configs = {}
    var inst = parseJSON(files['instrument.json'])
    for (var file in files) {
      var base = inst.samples
      if (minimatch(file, base + '*')) {
        samples[toCapital(file.slice(base.length, file.lastIndexOf('.')))] = file
      } else if (minimatch(file, '*.json')) {
        configs[file] = file
      }
    }
    var content = buildReadme(inst, samples, configs)
    console.log(content)
    files['README.md'] = fromStr(content)
  }
}

function MD () {
  var md = { str: '' }
  md.ln = function () { md.str += '\n'; return md }
  md.h1 = function (value) { md.str += '# ' + value + '\n\n'; return md }
  md.h2 = function (value) { md.str += '## ' + value + '\n\n'; return md }
  md.quote = function (value) { md.str += '> ' + value + '\n'; return md }
  md.li = function (value) { md.str += '- ' + value + '\n'; return md }
  md.p = function (value) { md.str += '\n' + value + '\n'; return md }
  return md
}

function link (name, href) {
  return '[' + name + ']' + '(' + href + ')'
}

function buildReadme (inst, samples, config) {
  var R = MD().h1(inst.name)
  if (inst.type) R.quote(inst.type)
  if (inst.description) R.p(inst.description).ln()
  if (inst.source) R.li('__Source__: ' + inst.source)
  if (inst.license) R.li('__License__: ' + inst.license)
  R.ln().h2('Samples')
  Object.keys(samples).forEach(function (name) {
    R.li(name + ' - ' + link(samples[name], inst.url + samples[name]))
  })
  R.ln().h2('Configuration')
  Object.keys(config).forEach(function (name) {
    R.li(link(name, inst.url + config[name]))
  })

  return R.str
}

function parseJSON (file) {
  return file ? JSON.parse(file.contents.toString()) : null
}

function fromStr (str) {
  return { contents: new Buffer(str) }
}

function fromJSON (obj) {
  return fromStr(JSON.stringify(obj, null, 2))
}
