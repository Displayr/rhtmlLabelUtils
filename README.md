# rhtmlLabelUtils

# To build

```npm run dist```

This must be run to generate `dist/index.js`, which is the entry point defined in `package.json`

# To test

### Two commands must be run in seperate terminals:

1. ```npm run serve```
1. jest test/

### To update the snapshots

1. ```npm run serve```
1. jest -u test/

Testing notes:

* that there are two sets of snapshots, as the rendering on headless vs not headless appears slightly different. Change the headless setting in [getHorizontalLabelDimensionsUsingSvgApproximation.settings.js](./test/getHorizontalLabelDimensionsUsingSvgApproximation.settings.js) 
* Also note the saved snapshots are generated on a 13" MBP running maxOS v 10.15.4
* the snapshots can be found [here](./test/snapshots)

# Background / history / context

labelUtils.js was introduced first in \[most likely\] rhtmlPictographs and then propogated via copy / paste in to rhtmlDonut, rhtmlHeatmap, rhtmlMoonplot, rhtmlPalmTrees, and most recently into rhtmlLabeledScatter.

Each version was slightly different as updates were made and not applied to previous uses.

This module is an attempt to create, maintain, test, and publish a standard version of labelUtils for consumption.

As I am building it only when I have a use case, it is not currently what I would call a fully featured repo.

For example, I have only ported a minimal version of `getLabelDimensionsUsingSvgApproximation` (i left out rotation support), and have not ported the following functions:

* `splitIntoLinesByWord`
* `splitIntoLinesByCharacter`
* `getLabelDimensionsUsingDivApproximation`
* `splitIntoLines`

The original versions of labelUtils have been collected in the [assets](./assets) directory.

On the why a bit:

* often you need to first specify preferred dimensions - which requires some analysis but not actual rendering. The the callee does some layout maths, then you get called with "this is the space you actually get", now render. So its important to not only expose render methods, but also the methods that can calculate expected dimensions.

# TODO
* (DEFER/WILLNOTDO) maybe drop the dependency on D3 ?  
* (DEFER/WILLNOTDO) travis ci
* (IN PROGRESS) support rotated label calculation and testing
* (IN PROGRESS) port `splitIntoLinesByWord` and `splitIntoLinesByCharacter`
* (IN PROGRESS) port something that will provide rendering instead of just maths
* (DEFER) echo settings in snapshots
* (DEFER) get list of font families to support based on what is available in Displayr UI
* () setup watch on live server
* () support onclick
* () add html/svg class specification / inspect current classes
* () In several places we still just assume height = fontSize 
* () split snapshots into multiple directories
* horizontal label center vertical align does not work
* vertical label alignments are not implemented

Test Notes
---

* AddLabel:
    * horizontal
        * 9 alignment combos - with wrapping (DONE)
        * basic fontSize / Weight / Family / color tests
        * respects bounds
        * respects maxLines
        * innerLinePadding
        
    * horizontal wrapping focused
      * test wrap by word and character
      * defer edge cases for now    
    
    * vertical topToBottom
        * 9 alignment combos - with wrapping
        * basic fontSize / Weight / Family / color tests
        * respects bounds
        * respects maxLines
        * innerLinePadding
        
    * vertical topToBottom wrapping focused
      * test wrap by word and character
      * defer edge cases for now    
      
    * vertical bottomToTop
        * 9 alignment combos - with wrapping
        * basic fontSize / Weight / Family / color tests
        * respects bounds
        * respects maxLines
        * innerLinePadding
        
    * vertical bottomToTop wrapping focused
      * test wrap by word and character
      * defer edge cases for now          
