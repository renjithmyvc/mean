var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

var paths = {
  sass: ['bower_components/bootstrap/dist/css/bootstrap.min.css', './stylesheets/*.scss', './stylesheets/*.css'],
  js: [
       'bower_components/jquery/dist/jquery.min.js',
       'bower_components/bootstrap/dist/js/bootstrap.min.js',       
       'bower_components/angular/angular.min.js',
       'bower_components/angular-route/angular-route.min.js',
       'bower_components/angular-resource/angular-resource.min.js',
       'bower_components/angular-recaptcha/release/angular-recaptcha.min.js',
       'bower_components/angular-sanitize/angular-sanitize.min.js',
       './javascripts/modules/*.js',
       './javascripts/services/*.js',
       './javascripts/controllers/*.js',
       './javascripts/directives/*.js',
      ]
};

gulp.task('js', function() {
  return gulp.src(paths.js)
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./src/'))
});

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
  .pipe(concat('all.min.scss'))
  .pipe(sass({
    errLogToConsole: true
  }))
  .pipe(gulp.dest('./src/'))
  .pipe(minifyCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({ extname: '.css' }))
  .pipe(gulp.dest('./src/'))
  .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['sass', 'js']);
