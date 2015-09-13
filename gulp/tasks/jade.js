var gulp = require("gulp");
var jade = require("gulp-jade");
var plumber = require("gulp-plumber");
var config = require('../config').jade;

gulp.task("jade", function () {
    gulp.src(config.src)
        .pipe(plumber()) // エラーが発生しても処理を継続
        .pipe(jade(config.options))
        .pipe(gulp.dest(config.dest));
});
