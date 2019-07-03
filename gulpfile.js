// const taskSequences = {
//   build: [ 'clean', ['compileWidgetEntryPoint', 'core', 'lint'], ['makeDocs'] ],
//   core: [ 'less', 'copy' ],
//   serve: [ ['core', 'compileInternal', 'compileExperiments', 'connect', 'openBrowser'], 'watch' ],
//   testSpecs: ['jestSpecTests'],
//   testVisual: [ 'core', 'compileInternal', 'connect', 'takeSnapshotsForEachTestDefinition' ],
//   testVisual_s: [ 'takeSnapshotsForEachTestDefinition' ],
//   compileInternal: [
//     'buildContentManifest',
//     'prepareInternalWwwCss',
//     'prepareRenderExamplePage',
//     'compileRenderContentPage',
//     'compileRenderIndexPage',
//     'processTestPlans'
//   ],
//   compileExperiments: [
//     'moveCrossExperimentSnapshotComparisonListToBrowser',
//     'buildExperimentManifest',
//     'copyExperimentHtmlAndSnapshots',
//     'compileExperimentJs'
//   ]
// }



const gulp = require('gulp')
const rhtmlBuildUtils = require('rhtmlBuildUtils')

const dontRegisterTheseTasks = ['copy', 'serve', 'testSpecs', 'compileInternal']


gulp.task('testSpecs', gulp.series(function (done) {
  done()
}))

gulp.task('copy', require('./build/tasks/copy')(gulp))
gulp.task('compileInternal', require('./build/tasks/compileInternal')(gulp))

rhtmlBuildUtils.registerGulpTasks({ gulp, exclusions: dontRegisterTheseTasks })

gulp.task('serve', gulp.series(['copy', 'compileInternal', ['connect', 'openBrowser'], 'watch' ]))
