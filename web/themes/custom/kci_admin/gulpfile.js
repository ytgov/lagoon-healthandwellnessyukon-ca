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
		pxtorem({
			propList: ['font', 'font-size', 'line-height', 'letter-spacing', '*margin*', '*padding*'],
			mediaQuery: true
		})
  ];

const paths = {
  scss: {
    src: './scss/style.scss',
    dest: './css',
    watch: './scss/**/*.scss',
  },
}

// Compile sass into CSS.
function styles () {
  return gulp.src([paths.scss.src])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        'node_modules/bootstrap/scss',
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

// Static Server + watching scss/html files
function serve () {
  gulp.watch([paths.scss.watch], styles)
}

const build = gulp.series(styles, gulp.parallel(serve))

exports.styles = styles
exports.serve = serve

exports.default = build
