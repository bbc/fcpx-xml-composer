# FCPX XML Composer

_work in progress_

Convert a [json sequence](./sample/input/example_sequence.json) into an FCPX XML.

Inspired by [EDL Composer](https://github.com/pietrop/edl_composer#readme) on [npm](https://www.npmjs.com/package/edl_composer) it uses the same schema to describe the sequence. 

Part of the [`bbc/digital-paper-edit`](https://github.com/bbc/digital-paper-edit) project by BBC News Labs


## Setup
<!-- _stack - optional_
_How to build and run the code/app_ -->

cd, clone the repo, `npm install`

## Usage - development

see [`example-usage.js`](./example-usage.js) for how to requrie and use the module.

To run the example do `node example-usage.js`


When importing the `.fcpxml` sequence in FCPX the media is going to be offline, to re-link the media go to `Files` `->` `Relink  Files` or see 
[see Re-link offline clips in FCPX, for more details](https://support.apple.com/kb/PH12701?locale=en_US).

## Usage - production

```
npm install @bbc/fcpx-xml-composer
```

require or import in your code and see example usage for more details


## System Architecture
<!-- _High level overview of system architecture_ -->

A function that loop over the json sequence and using string interpolation creates an equivalent FCPX XML. With no dependencies.

Used the sequence form [the docs - `Listing 1-1  A library with a simple project as FCPXML`](https://developer.apple.com/library/archive/documentation/FinalCutProX/Reference/FinalCutProXXMLFormat/EventsandProjects/EventsandProjects.html) as a starting point.

FCPX seems particularly picky about specifying the correct frame rate for the clips in the sequence.

>Relinked files must have the same media type, same frame rate, and similar audio channels as the original files, and must be long enough to cover all the clips that reference the files.

[DTD errors FCPX reference](https://developer.apple.com/library/archive/documentation/FinalCutProX/Reference/FinalCutProXXMLFormat/FCPXMLDTD/FCPXMLDTD.html)

A Known limitation is that the EDL composer sequence only supports one track, as the EDL format is not multi track. FCPX sequence could allow multiple tracks. But for the current use case with `digital-paper-edit` one track is sufficient. PRs might be considered to extend this module to multi track support.

## Development env
 <!-- _How to run the development environment_
_Coding style convention ref optional, eg which linter to use_
_Linting, github pre-push hook - optional_ -->

- [ ] npm > `6.1.0`
- [ ] node v 10 - [lts/dubnium](https://scotch.io/tutorials/whats-new-in-node-10-dubnium)
<!-- - [ ] see [`.eslintrc`](./.eslintrc) in the various packages for linting rules
Node version is set in node version manager [`.nvmrc`](https://github.com/creationix/nvm#nvmrc) -->

## Build
<!-- _How to run build_ -->

_NA_

## Tests
<!-- _How to carry out tests_ -->

_TBC_

## Deployment
<!-- _How to deploy the code/app into test/staging/production_ -->

_TBC - published to npm under `@bbc/fcpx-xml-composer`_



<!-- Other
https://www.npmjs.com/package/bmjs-fcpxml
-->


## TODO:
- [ ] Add support for optional `offset` (in a way supported by FCPX XML) <!-- needs testing with footage from camcorder  -->