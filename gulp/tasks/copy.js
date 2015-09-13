var gulp = require('gulp');
var config = require('../config').copy;

gulp.task('copy', function () {
    gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
    gulp.src(config.libdir, { base: 'lib' })
        .pipe(gulp.dest(config.dest + '/lib'));
});
