var gulp = require('gulp');
var uglifyjs = require('gulp-uglifyjs');
var header = require('gulp-header');
var pkg = require('./package.json');

var banner = '/*! <%= pkg.name %> <%= pkg.version %> | (c) 2015 <%= pkg.author %> | <%= pkg.license %> */\n';

gulp.task('js', function() {
    gulp.src('src/jquery.cascadingdropdown.js')
        .pipe(gulp.dest('dist/'))
        .pipe(uglifyjs('jquery.cascadingdropdown.min.js', { outSourceMap: true }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['js']);