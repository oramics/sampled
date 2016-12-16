
function MD () {
  var str = ''
  const md = {
    p: (...args) => chain(args.join('\n') + '\n\n'),
    linebreak: () => { str += '\n'; return md },
    h1: title => chain(`# ${title}\n\n`),
    h2: title => chain(`## ${title}\n\n`),
    h3: title => chain(`### ${title}\n\n`),
    quote: (value) => { str += '> ' + value + '\n'; return md },
    li: (value) => { str += '- ' + value + '\n'; return md },
    lip: (value, desc) => chain(`- ${MD.b(value)}: ${desc}\n`),
    code: (code) => chain('```\n' + code + '```\n'),
    toString: () => str
  }
  const chain = (a) => { str += a; return md }
  return md
}
MD.i = (s) => '_' + s + '_'
MD.b = (s) => '__' + s + '__'
MD.a = (name, url) => `[${name}](${url})`

function getJSON (file) {
  return file ? JSON.parse(file.contents.toString()) : null
}

function strToFile (str) {
  return { contents: new Buffer(str) }
}

function objToFile (obj) {
  return strToFile(JSON.stringify(obj, null, 2))
}

module.exports = { MD, getJSON, strToFile, objToFile }
