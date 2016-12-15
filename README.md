# Sampled

This repository is a collection of sampled instruments, loops or impulse responses with public domain or similar license. The purpose is to provide accesible and ready to use quality samples for audio applications (specifically audio web apps).

Read [USAGE](https://github.com/danigb/sampled/tree/master/USAGE.md) or
[CONTRIBUTE](https://github.com/danigb/sampled/tree/master/CONTRIBUTE.md)

## How it works

This repository is publicly accepsible thanks to github.io, so you can copy and paste any url (for example: https://danigb.github.io/sampled/DM/MRK-2/samples/kick.wav in https://danigb.github.io/sampled/DM/MRK-2/) and fetch it using javascript:

```js
var fetchAsAudioBuffer = require('fetch-as-audio-buffer')

fetchAsAudioBuffer(new AudioContext(), 'https://danigb.github.io/sampled/DM/MRK-2/samples/clave.wav').then((buffer) => {
  // play(buffer)
})
```

## Available collections

### Drum machines

- __[CR-78](https://danigb.github.io/sampled/DM/CR-78)__: Roland CompuRythm CR-78
- __[LM-2](https://danigb.github.io/sampled/DM/LM-2)__: LinnDrum LM-2
- __[MRK-2](https://danigb.github.io/sampled/DM/MRK-2)__: Maestro Rhythm King MRK-2
- __[TR-505](https://danigb.github.io/sampled/DM/TR-505)__: Roland TR-505
- __[TR-909 Detroit](https://danigb.github.io/sampled/DM/TR-909/Detroit)__: Roland TR-909 recorder via API and Neve

### Acoustic Drums

- __[Pearl Master Studio](https://danigb.github.io/sampled/DRUMS/pearl-master-studio)__: Pearl Master Studio Pack 1 by enoe

### Impulse responses

- __[EMT-140 Plate](https://danigb.github.io/sampled/IR/EMT140-Plate)__: Greg Hopkins EMT 140 Plate Reverb Impulse Response
- __[Voxengo-IR](https://danigb.github.io/sampled/IR/Voxengo)__: Voxengo Free Reverb Impulse Responses

## Licenses

Each instrument has it's own license.

All code has MIT License
