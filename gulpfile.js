var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyImage = require('gulp-imagemin');
var cache = require('gulp-cache');
var concatCss = require('gulp-concat-css');

var JS_SOURCE = 'src/js';
var JS_DEST = 'dist/js';
var JS_OUTPUT_FILE = 'main.js';
var CSS_SOURCE = 'src/sass';
var CSS_DEST = 'dist/css';
var IMAGE_SOURCE = 'src/img';
var IMAGE_DEST = 'dist/img';
var SERVER_BASE_DIR = './dist';
var WATCH_FILE_EXTENSIONS = ['*.html'];

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: SERVER_BASE_DIR
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('javascript', function() {
  return gulp.src(JS_SOURCE + '/**/*.js')
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        generator.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(babel())
    .pipe(gulp.dest(JS_DEST + '/'))
    .pipe(browserSync.reload({ stream:true }))
});

gulp.task('css', function() {
  gulp.src(CSS_SOURCE + '/**/*.scss')
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        generator.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concatCss("styles.css"))
    .pipe(gulp.dest(CSS_DEST + '/'))
    .pipe(browserSync.reload({ stream:true }))
});

gulp.task('images', function() {
  gulp.src(IMAGE_SOURCE + '/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(IMAGE_DEST + '/'));
});

gulp.task('default', ['browser-sync','css','javascript'], function() {
  gulp.watch(JS_SOURCE + '/**/*.js', ['javascript']).on('change',browserSync.reload);
  gulp.watch(CSS_SOURCE + '/**/*.scss', ['css']).on('change',browserSync.reload);
  gulp.watch("dist/**/*"+WATCH_FILE_EXTENSIONS).on('change',browserSync.reload);
});
