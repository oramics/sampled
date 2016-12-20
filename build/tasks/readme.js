const handlebars = require('handlebars')
const META = '/sampled.json'

module.exports = function (repo) {
  return function (files) {
    for (var name in files) {
      if (name.endsWith(META)) {
        const meta = repo.fileToObj(files[name])
        const props = Object.keys(meta).sort().reduce(function (props, key) {
          if (typeof meta[key] === 'string') props.push({ key, value: meta[key] })
          return props
        }, [])
        /* eslint-disable object-property-newline */
        const readme = template({
          meta, props,
          URL: repo.URL,
          group: meta.url.slice(repo.URL.length + 1).split('/')[0],
          formatted: JSON.stringify(meta, null, 2)
        })
        const path = name.slice(0, -META.length + 1)
        files[path + 'README.md'] = repo.strToFile(readme)
      }
    }
  }
}

const README =
`
[Sampled](https://oramics.github.io/sampled) /
[{{meta.type}}]({{BASE}}/{{group}})

# {{meta.name}}

{{#each props}}
- __{{this.key}}__: {{this.value}}
{{/each}}

## Samples

{{#each meta.files}}
- __\`{{this}}\`__: [\`{{this}}\`]({{../meta.samples}}{{this}})
{{/each}}

## Metadata

\`\`\`json
{{{formatted}}}
\`\`\`

`

const template = handlebars.compile(README)
