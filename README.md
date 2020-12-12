# rhtmlLabelUtils

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
1. ```npm run test -- -t split```


### To update the snapshots

(commands in seperate terminals):

1. ```npm run watch```
1. ```npm run test -- -u```

## Testing notes:

* that there are two sets of snapshots, as the rendering on headless vs not headless appears slightly different. Change the headless setting in [config.js](./test/utils/config.js) 
* note the saved snapshots are generated on a 16" MBP running maxOS v 11.0.1. No CI intetgration at present
* the snapshots can be found [here](./test/snapshots)

### To live dev

1. ```npm run watch```

* Changes to code will cause server restart with updated code bundle. Manual browser refresh still required (no live reload yet)
* Changes to HTML will cause server restart. Manual browser refresh still required (no live reload yet)

# Background / history / context

labelUtils.js was introduced first in \[most likely\] rhtmlPictographs and then propogated via copy / paste in to rhtmlDonut, rhtmlHeatmap, rhtmlMoonplot, rhtmlPalmTrees, and most recently into rhtmlLabeledScatter.

Each version was slightly different as updates were made and not applied to previous uses.

This module is an attempt to create, maintain, test, and publish a standard version of labelUtils for consumption.

As I am building it only when I have a use case, it is not currently what I would call a fully featured repo.

The original versions of labelUtils have been collected in the [assets](./assets) directory.

### Rationale for implementaiton:

* often you need to first specify preferred dimensions - which requires some analysis but not actual rendering. The the callee does some layout maths, then you get called with "this is the space you actually get", now render. So its important to not only expose render methods, but also the methods that can calculate expected dimensions.

# TODO
* (DEFER/WILLNOTDO) maybe drop the dependency on D3 ?  
* (DEFER/WILLNOTDO) travis ci
* (DEFER) get list of font families to support based on what is available in Displayr UI
* () add html/svg class specification / inspect current classes
* () In several places we still just assume height = fontSize 
* () Diagonal (on 45 degree increments)  
* () Linting
* () test getDimensions
* () more test then refactor splitIntoLines. Likely has lots of bugs

# Known issues
* splitIntoLines: see the "BUG: single large word causes label to go out of bounds" in splitIntoLines.test.js
