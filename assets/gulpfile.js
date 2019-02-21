const project      = 'xtandi';
const gulp         = require('gulp');
const uglify       = require('gulp-uglify');
const buffer       = require("vinyl-buffer");
const sass         = require('gulp-sass');
const concat       = require('gulp-concat');
const rename       = require('gulp-rename');
const cleanCSS     = require('gulp-clean-css');
const cleanJS      = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const browserify   = require('browserify');
const babelify     = require('babelify');
const source       = require('vinyl-source-stream');
const gutil        = require('gulp-util');

const paths = {
	cssSource : 'sass/**/*.scss',
	jsSource  : 'js/**/*.js',
	cssDest   : '../build/assets/css',
	jsDest    : '../build/assets/js'
};


gulp.task('sass', function () {
	return gulp.src('sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
		browsers: ['last 3 versions'],
		cascade: false
	}))
    .pipe(cleanCSS())
    .pipe(rename(project+'.min.css'))
    .pipe(gulp.dest(paths.cssDest));
});

gulp.task('watch', function() {
	gulp.watch(paths.cssSource, ['sass']);
	gulp.watch(paths.jsSource,['es6']);
});

gulp.task('es6', function() {
	browserify({
    	entries: './js/app.js',
    	debug: true
  	})
    .transform(babelify)
    .on('error',gutil.log)
    .bundle()
    .on('error',gutil.log)
    .pipe(source(project+'.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.jsDest));
});

/**
 * Gulp default task - Build and watch
 */
gulp.task('default',['watch']);
//gulp.task('default',['sass','scripts','watch']);