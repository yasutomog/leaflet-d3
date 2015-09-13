var gulp = require('gulp');
var watch = require('gulp-watch');
var config = require('../config').watch;

gulp.task('watch', function () {

    // js
    watch(config.js, function () {
        gulp.start(['webpack']);
    });

    // styl
    watch(config.styl, function () {
        gulp.start(['stylus']);
    });

    // jade
    watch(config.jade, function() {
        gulp.start(['jade']);
    });

    // www
    watch(config.www, function () {
        gulp.start(['copy']);
    });

});
