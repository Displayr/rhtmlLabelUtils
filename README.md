# rhtmlLabelUtils

SVG text label generation utilities for wrapped horizontal and vertical labels. Diagonal labels are a current WIP.
Library assumes use of D3. 

Currently used in the following projects:
* [rhtmlHeatmap](https://github.com/Displayr/rhtmlHeatmap)

# Usage

A usage example is included here : [usage.js](test/interface/usage.js).
This can alse be viewed when the test webserver is running at `http://localhost:9000/content/usage`

# To build

```npm run dist```

This must be run to generate `dist/index.js`, which is the entry point defined in `package.json`.
The `dist` code is what other modules will use when they import `rhtmlLabelUtils`.

# Testing Scenarios

### Run test

(commands in seperate terminals):

1. ```npm run watch```
1. ```npm run test```

### Run specific test

(commands in seperate terminals):

1. ```npm run watch```
1. ```npm run test -- -t testFile_or_testName```

### To update the snapshots

(commands in seperate terminals):

1. ```npm run watch```
1. ```npm run test -- -u```

## Testing notes:

* the test framework uses [jest](npmjs.com/package/jest), [puppeteer](https://www.npmjs.com/package/puppeteer), and [jest-image-snapshot](https://www.npmjs.com/package/jest-image-snapshot)
* there are two sets of snapshots directories, as the rendering on headless vs not headless appears slightly different. Change the headless setting in [config.js](./test/utils/config.js) 
* the saved snapshots are generated on a 16" MBP running maxOS v 11.0.1. No CI intetgration at present. I suspect subtle differences will arise from environment, so best test approach is to collect snapshots before and after any updates using a stable test environment 
* the snapshots can be found [here](./test/snapshots)

### To live dev

1. ```npm run watch```

* Changes to code will cause server restart with updated code bundle. Manual browser refresh still required (no live reload yet)
* Changes to HTML will cause server restart. Manual browser refresh still required (no live reload yet)
* Override port via `PORT=12345 npm run watch`

# Background / history / context

labelUtils.js was introduced first in \[most likely\] rhtmlPictographs and then propogated via copy / paste in to rhtmlDonut, rhtmlHeatmap, rhtmlMoonplot, rhtmlPalmTrees, and most recently into rhtmlLabeledScatter.

Each version was slightly different as updates were made and not applied to previous uses.

This module is an attempt to create, maintain, test, and publish a standard version of labelUtils for consumption.

As I am building it only when I have a use case, it is not currently what I would call a fully featured repo.

The original versions of labelUtils have been collected in the [assets](./assets) directory.

### Rationale for implementaiton:

* often you need to first specify preferred dimensions - which requires some analysis but not actual rendering. The the callee does some layout maths, then you get called with "this is the space you actually get", now render. So its important to not only expose render methods, but also the methods that can calculate expected dimensions.

# TODO

Diagonal support is only WIP and I wouldn't recommend using them yet.

* (DEFER/WILLNOTDO) maybe drop the dependency on D3 ?  
* (DEFER) get list of font families to support based on what is available in Displayr UI
* () add html/svg class specification / inspect current classes
* () In several places we still just assume height = fontSize 
* () Diagonal (on 45 degree increments)
* () Linting
* () test getDimensions
* () more test then refactor splitIntoLines. Likely has lots of bugs
* () Travis CI integration

# Known issues
* splitIntoLines: see the "BUG: single large word causes label to go out of bounds" in splitIntoLines.test.js
