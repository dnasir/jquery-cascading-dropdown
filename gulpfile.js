var gulp = require('gulp');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var pkg = require('./package.json');

var year = new Date().getFullYear();
var banner =
  '/*! <%= pkg.name %> <%= pkg.version %> | (c) ' +
  year +
  ' <%= pkg.author %> | <%= pkg.license %> */\n';

gulp.task('js', function() {
  return gulp
    .src('src/jquery.cascadingdropdown.js')
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('dist/'))
    .pipe(rename('jquery.cascadingdropdown.min.js'))
    .pipe(sourcemaps.init())
    .pipe(
      uglify({
        output: {
          comments: /^!/
        }
      })
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
});

gulp.task('webserver', function(done) {
  connect.server({
    livereload: true
  });
  done();
});

gulp.task('watch', function(done) {
  gulp.watch('src/jquery.cascadingdropdown.js', gulp.series(['js']));
  done();
});

gulp.task('default', gulp.series(['js']));
gulp.task('dev', gulp.parallel(['webserver', 'watch']));
