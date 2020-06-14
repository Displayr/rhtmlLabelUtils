# rhtmlLabelUtils

# To build

```npm run dist```

This must be run to generate `dist/index.js`, which is the entry point defined in `package.json`

# To test

### Two commands must be run in seperate terminals:

1. gulp serve
1. jest test/

### To update the snaphots

1. gulp serve
1. jest -u test/

Testing notes:

* that there are two sets of snapshots, as the rendering on headless vs not headless appears slightly different. Change the headless setting in [getHorizontalLabelDimensionsUsingSvgApproximation.settings.js](./test/getHorizontalLabelDimensionsUsingSvgApproximation.settings.js) 
* Also note the saved snapshots are generated on a 13" MBP running maxOS v 10.15.4
* the snapshots can be found [here](./test/snapshots)

# Background / history / context

labelUtils.js was introduced first in \[most likely\] rhtmlPitcographs and then propogated via copy / paste in to rhtmlDonut, rhtmlHeatmap, rhtmlMoonplot, rhtmlPalmTrees, and most recently into rhtmlLabeledScatter.

Each version was slightly different as updates were made and not applied to previous uses.

This module is an attempt to create, maintain, test, and publish a standard version of labelUtils for consumption.

As I am building it only when I have a use case, it is not currently what I would call a fully featured repo.

For example, I have only ported a minimal version of `getLabelDimensionsUsingSvgApproximation` (i left out rotation support), and have not ported the following functions:

* `splitIntoLinesByWord`
* `splitIntoLinesByCharacter`
* `getLabelDimensionsUsingDivApproximation`
* `splitIntoLines`

The original versions of labelUtils have been collected in the [assets](./assets) directory.

# TODO
* (DEFER) add npm test script. 
  * Blocked on : `gulp serve` will never return. Solution is to mimic what is done in build
  * Required task here is to pull jest into a gulp task
* (DEFER) maybe drop the dependency on rhtmlBuildUtils and gulp ?
* (DEFER) maybe drop the dependency on D3 ?  
* (DEFER) travis ci
* (DEFER) support rotated label calculation and testing
* (DEFER) port `splitIntoLinesByWord` and `splitIntoLinesByCharacter`
* (DEFER) port something that will provide rendering instead of just maths
* (DEFER) echo settings in snapshots
* (DEFER) get list of font families to support based on what is available in Displayr UI
