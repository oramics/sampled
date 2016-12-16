var Task = require('../files.js')

Task('Remove index.md files', (files) => {
  for (var file in files) {
    if (file.endsWith('index.md')) delete files[file]
  }
})
