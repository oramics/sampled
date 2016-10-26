# Sampled

This repository is a collection of sampled instruments with public domain or similar license. The purpose is to provide accesible and ready to use quality samples for audio applications (specifically audio web apps).

## Available instruments

Currently only some drum machines are available:

- [CR-78](https://github.com/danigb/sampled/tree/master/CR-78): Roland CompuRythm CR-78
- [LM-2](https://github.com/danigb/sampled/tree/master/LM-2): LinnDrum LM-2
- [MRK-2](https://github.com/danigb/sampled/tree/master/MRK-2): Maestro Rhythm King MRK-2.
- [TR-505](https://github.com/danigb/sampled/tree/master/TR-505): Roland TR-505
- [CR-78](https://github.com/danigb/sampled/tree/master/CR-78): Roland CompuRythm CR-78


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


## Contribute with a sampled instrument

To contribute to this project you have to:

- Fork this repository
- Create a directory with the name of the instrument
- Create a instrument.json file with metadata information
- Create a subdirectory called samples with the audio files
- run `npm i -g audio-pack` and `audiopack path/to/instrument.json`
- run the example to test the sounds: `beefy example/example.js`
- Update the `instruments.json` file with the new instrument
- Make a pull request

#### Drum machines sample naming conventions

The samples audio files should be named: `inst-variation.ext` where `inst` is the instrument name and `variation` is optional. For example: `snare.wav`, `hihat-open.wav` and `hihat-closed.wav` are valid names. Variations can be nested: `hihat-open-h.wav`

#### Using letters to create variations

The letters `m`, `l` and `h` means mid, lower and higher. `snare-l.wav` it should be a lower snare than `snare-m.wav` and `snare-ll.wav` should be even lower.

#### Using numbers to create variations

You can use numbers padding by 2. `snare-01.wav` is valid, but `snare-1.wav` is not. Anyway, more descriptive variations are preferred: `guiro-long.wav` and `guiro-short.wav` vs. `guiro-01.wav` and `guiro-02.wav`

#### Recommended instrument names

Try to name the sample with one of this names, if possible:

- __snare__
- __rim__ (rimshot, sidesticks)
- __hihat__ (variations: `hihat-open`, `hihat-closed`)
- __kick__
- __tom__
- __crash__
- __cymball__
- __clap__
- __bongo__
- __conga__
- __tamb__ (tambourine)
- __block__
- __cowbell__
- __timbal__
- __cabasa__
- __guiro__
- __clave__

## License

Each instrument has it's own license.
