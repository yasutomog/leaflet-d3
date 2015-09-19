var gulp = require('gulp');
var webserver = require('gulp-webserver');
var config = require('../config');

gulp.task('webserver',function(){
    gulp.src(config.dest)
        .pipe(webserver({
            livereload: false,
            port: 8001,
            fallback: 'index.html',
            open: true
        }));
});
