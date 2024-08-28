const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

function styles() {
  return src('app/scss/main.scss')
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
};

function scripts() {
  return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function watching() {
  browserSync.init({
    server: {
        baseDir: "app/"
    }
  });
  watch(['app/scss/**/*.scss'], styles)
  watch(['app/js/main.js'], scripts)
  watch(['app/*.html']).on('change', browserSync.reload)
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/**/*.html',
    'app/images/**/*.*',
    'app/fonts/*.*'
  ],{base: 'app'})
  .pipe(dest('dist'));
}

function cleanDist() {
  return src('dist')
    .pipe(clean())
}


exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist,building);
exports.start = parallel(styles,scripts,watching);