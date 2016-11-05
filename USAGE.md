# Usage

## Fetching instruments or samples

All samples and metadata are available through github.io in this base url:
https://danigb.github.io/sampled

For example:

- Instrument metadata: https://danigb.github.io/sampled/CR-78/instrument.json
- All samples in .json packed format: https://danigb.github.io/sampled/CR-78/CR-78.json
- Single sample: https://danigb.github.io/sampled/CR-78/samples/cowbell.wav

You can use `audio-loader` or a similar module to fetch instruments. For example, loading all samples at once:

```js
var ac = new AudioContext()
var loader = require('audio-loader')
loader.load(ac, 'https://danigb.github.io/sampled/CR-78/CR-78.json').then(function (samples) {
  samples['kick'] // => AudioBuffer
})
```

Or load a single sample:

```js
loader.load(ac, 'https://danigb.github.io/sampled/CR-78/samples/cowbell.wav').then(function (cowbell) {
  // cowbell variable contains an AudioBuffer
})
```
