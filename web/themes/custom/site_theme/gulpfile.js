let gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  sourcemaps = require('gulp-sourcemaps'),
  $ = require('gulp-load-plugins')(),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  postcssInlineSvg = require('postcss-inline-svg'),
  pxtorem = require('postcss-pxtorem'),
	postcssProcessors = [
		postcssInlineSvg({
      removeFill: true,
      paths: [
        './images',
        './images/icons',
        '../kci_base/images',
        '../kci_base/images/icons',
        './node_modules/bootstrap-icons/icons',
      ]
    }),
		pxtorem({
			propList: ['font', 'font-size', 'line-height', 'letter-spacing', '*margin*', '*padding*'],
			mediaQuery: true
		})
  ];

const paths = {
  scss: {
    src: './scss/style.scss',
    mailSrc: './scss/mail.scss',
    ckEditorSrc: './scss/ckeditor.scss',
    dest: './css',
    watch: './scss/**/*.scss',
    parent_watch: '../kci_base/scss/**/*.scss',
    bootstrap: './node_modules/bootstrap/scss/bootstrap.scss',
    scroll_animations: '../kci_base/scss/scroll-animations.scss',
  },
  js: {
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
    bootstrapmap: './node_modules/bootstrap/dist/js/bootstrap.min.js.map',
    popper: './node_modules/@popperjs/core/dist/umd/popper.min.js',
    poppermap: './node_modules/@popperjs/core/dist/umd/popper.min.js.map',
    barrio: '../../contrib/bootstrap_barrio/js/barrio.js',
    dest: '../kci_base/js'
  }
}

function mailStyles () {
  return gulp.src([paths.scss.mailSrc])
    .pipe(sass({
      includePaths: [
        './node_modules/bootstrap/scss',
        '../../contrib/bootstrap_barrio/scss'
      ]
    }).on('error', sass.logError))
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12']
    })]))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
}

// Compile sass into CSS.
function styles () {
  return gulp.src([paths.scss.bootstrap, paths.scss.src, paths.scss.scroll_animations])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        './node_modules/bootstrap/scss',
        '../kci_base/scss',
        '../../contrib/bootstrap_barrio/scss'
      ]
    }).on('error', sass.logError))
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12']
    })]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
}

function ckEditorStyles () {
  return gulp.src([paths.scss.ckEditorSrc])
    .pipe(sass({
      includePaths: [
        './node_modules/bootstrap/scss',
        '../kci_base/scss',
        '../../contrib/bootstrap_barrio/scss'
      ]
    }).on('error', sass.logError))
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12']
    })]))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
}

// Move the javascript files into our js folder
function js () {
  return gulp.src([paths.js.bootstrap, paths.js.bootstrapmap, paths.js.popper, paths.js.poppermap, paths.js.barrio])
    .pipe(gulp.dest(paths.js.dest))
}

// Static Server + watching scss/html files
function serve () {
  gulp.watch([paths.scss.watch, paths.scss.parent_watch, paths.scss.bootstrap], styles)
  gulp.watch([paths.scss.watch, paths.scss.parent_watch, paths.scss.bootstrap], mailStyles)
  gulp.watch([paths.scss.watch, paths.scss.parent_watch, paths.scss.bootstrap], ckEditorStyles)
}

const build = gulp.series(styles, ckEditorStyles, mailStyles, gulp.parallel(js, serve))

exports.styles = styles
exports.mailStyles = mailStyles
exports.ckEditorStyles = ckEditorStyles
exports.js = js
exports.serve = serve

exports.default = build
