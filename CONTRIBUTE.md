# Contribute

To contribute to this project you have to:

- Fork this repository
- Create a directory with the name of the instrument
- Create a instrument.json file with metadata information
- Create a subdirectory called samples with the audio files
- Make a pull request

## Drum machines sample naming conventions

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
