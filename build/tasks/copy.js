// TODO the method for knowing when we are done is crude and
// relies on author to keep requiredCount and all calls to incrementFinishCount up to date

module.exports = function (gulp) {
  return function (done) {
    let finishedCount = 0
    const requiredCount = 2
    const incrementFinishedCount = () => finishedCount++

    gulp.src([
      'internal_www/**/*'
    ], {})
      .pipe(gulp.dest('browser'))
      .on('finish', incrementFinishedCount)

    // only used directly in browser by renderExample.html
    const internalWebServerDependencies = [
      'node_modules/d3/dist/d3.js'
    ]

    gulp.src(internalWebServerDependencies)
      .pipe(gulp.dest('browser/external/'))
      .on('finish', incrementFinishedCount)


    const intervalHandle = setInterval(() => {
      if (finishedCount >= requiredCount) {
        clearInterval(intervalHandle)
        done()
      }
    }, 20)
  }
}
