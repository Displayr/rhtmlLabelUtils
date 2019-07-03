const path = require('path')
const { lib: { compileES6 } } = require('rhtmlBuildUtils')

module.exports = function (gulp) {
  return function (done) {
    compileES6({
      gulp,
      entryPointFile: path.join(__dirname, '../../test/utils/addLabelUtilsToWindow.js'),
      destinationDirectory: path.join(__dirname, '../../browser/js/'),
      callback: done
    })
  }
}

