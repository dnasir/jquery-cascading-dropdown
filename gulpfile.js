var gulp = require('gulp');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var pkg = require('./package.json');

var year = new Date().getFullYear();
var banner = '/*! <%= pkg.name %> <%= pkg.version %> | (c) ' + year + ' <%= pkg.author %> | <%= pkg.license %> */\n';

gulp.task('js', function() {
    gulp.src('src/jquery.cascadingdropdown.js')
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/'))
        .pipe(rename('jquery.cascadingdropdown.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify({ preserveComments: 'license' }))        
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['js']);