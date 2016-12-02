// dependencies
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var del = require('del');
var deploy = require('gulp-gh-pages');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');

// paths
var PATH = {
  DEV: 'src',
  BUILD: 'static',
  DIST:'dist'
};

/**
 * processSCSS
 * compile and concat SCSS
 *
 * @method task
 * @param  {string} processSCSS [task name]
 * @param  {function} function [task function]
 * @return gulp stream
 */
gulp.task('processSCSS', function () {
  return gulp.src(PATH.DEV+'/style/client.scss')
    .pipe(sourcemaps.init())

    .pipe(sass({
      errLogToConsole: false,
      outputStyle: 'expanded'
    }).on('error', sass.logError))

    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 8', '> 5%'],
      cascade: false
    }))

    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(PATH.DEV+'/style'));
});

/**
 * watch scss
 * reload browser after 'porcessSCSS' is done
 * @method task
 * @param  {string} watchSCSS [task name]
 * @param  {array} processSCSS [tasks to exec before this task]
 * @return {undefined}
 */
gulp.task('watchSCSS', ['processSCSS'], function (done) {
  browserSync.reload();
  done();
});

/**
 * processJS
 * compile and concat JS
 *
 * @method task
 * @param  {string} processJS [task name]
 * @param  {function} function [task function]
 * @return gulp stream
 */
gulp.task('processJS', function () {
  return gulp.src([
    PATH.DEV+'/js/client/init.js',
    PATH.DEV+'/js/client/*.js'
  ])
    .pipe(sourcemaps.init())
    // .pipe(babel())
    // .on('error', function (e) {
    //   console.log('>>> ERROR', e);
    //   // emit here
    //   this.emit('end');
    // })
    .pipe(concat({
      path: 'client.js'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(PATH.DEV+'/js'));
});

/**
 * watchJS
 * reload browser after 'porcessJS' is done
 *
 * @method task
 * @param  {string} watchJS [task name]
 * @param  {array} processJS [tasks to exec before this task]
 * @param  {function} function [task function]
 * @return {undefined}
 */
gulp.task('watchJS', ['processJS'], function (done) {
  browserSync.reload();
  done();
});
/**
 * javascript linter
 * ESLINT
 *
 * @method task
 * @param  {string} lint [task name]
 * @param  {function} function [task function]
 * @return gulp stream
 */
gulp.task('lint', function () {
  return gulp.src(PATH.DEV+'/js/client/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

/**
 * default task
 * browserSync + src watch tasks
 *
 * @method task
 * @param  {string} default [task name]
 * @param  {function} function [task function]
 * @return {undefined}
 */
gulp.task('default', function () {
  // browserSync
  browserSync.init({
    server: {
      baseDir: PATH.DEV,
      routes: {
        '/node_modules': './node_modules'
      }
    },
    notify: false,
  });

  // watch tasks
  gulp.watch(PATH.DEV+'/style/**/*.scss', ['watchSCSS']);
  gulp.watch(PATH.DEV+'/js/client/*.js', ['watchJS']);
  gulp.watch(PATH.DEV+'/*.html').on('change', browserSync.reload);
});

/**
 * clean
 * cleans PATH.BUILD dir
 *
 * @method task
 * @param  {string} clean [task name]
 * @param  {function} function [task function]
 * @return gulp stream
 */
gulp.task('clean', function () {
  return del(PATH.BUILD);
});

/**
 * copy
 * copies font folder to PATH.BUILD
 *
 * @method task
 * @param  {string} clean [task name]
 * @param  {function} function [task function]
 * @return gulp stream
 */
gulp.task('copy', function () {
  return gulp.src([
    PATH.DEV+'/fonts/**/**/*'
  ], {
    base: PATH.DEV
  })
  .pipe(gulp.dest(PATH.BUILD));
});

/**
 * usemin
 * concat js & css in index.html
 *
 * @method task
 * @param  {string} clean [task name]
 * @param  {function} function [task function]
 * @return gulp stream
 */
gulp.task('usemin', function () {
  return gulp.src(PATH.DEV+'/index.html')
    .pipe(usemin({
      css: [cleanCss],
      js: [uglify],
    }))
    .pipe(gulp.dest(PATH.BUILD));
});

/**
 * imagemin
 * minifies images
 *
 * @method task
 * @param  {string} clean [task name]
 * @param  {function} function [task function]
 * @return gulp stream
 */
gulp.task('imagemin', function () {
  return gulp.src(PATH.DEV+'/images/**')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }, {
        cleanupIDs: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(PATH.BUILD+'/images'));
});

/**
 * build
 * build task - runs task in sequence
 *
 * @method task
 * @param  {string} build [task name]
 * @param  {function} function [task function]
 * @return {undefined}
 */
gulp.task('build', function (callback) {
  runSequence('clean', ['usemin', 'copy', 'imagemin'], callback);
});

/**
 * serveBuild
 * @method task
 * @param  {string} serveBuild [task name]
 * @param  {function} function [task function]
 * @return {undefined}
 */
gulp.task('serveBuild', function () {
  // browserSync
  browserSync.init({
    server: {
      baseDir: PATH.BUILD,
      routes: {
        '/node_modules': './node_modules'
      }
    },
    notify: false,
  });
});

gulp.task('ghpages', function () {
  return gulp.src(PATH.BUILD +'/**/*')
  .pipe(deploy());
});

gulp.task('deploy', function (callback) {
  runSequence('build', ['ghpages'], callback);
});
