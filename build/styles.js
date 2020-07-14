'use strict'
import gulp from 'gulp';
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import sassGlob from 'gulp-sass-glob';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import notify from 'gulp-notify';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
const  browser = browserSync.create();

const OUTPUT_FILE_NAME = 'jca-ui-kit.min.css';

const DIST_FOLDERS = {
	CSS: 'css',
	ROOT: 'docs',
};

const INPUT_FOLDERS = {
	CSS: './src/styles',
	ROOT: './src',
};

const BUILD_STYLES = gulp.task(
	'build:styles',
	function(){
		return gulp.src([`${INPUT_FOLDERS.CSS}/**/*.scss`])
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			.pipe(sourcemaps.init())
			.pipe(sassGlob())
			.pipe(sass({
				style: 'compressed',
				errLogToConsole: false,
				onError: function(error_message) {
					return notify().write(error_message);
				}
			}))
			.pipe(autoprefixer())
			.pipe(cleanCSS({
				compatibility: 'ie9',
				level: {
					1: {
						specialComments: 'all',
					}
				}
			}))
			.pipe(sourcemaps.write())
			.pipe(concat(OUTPUT_FILE_NAME))
			.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/${DIST_FOLDERS.CSS}`))
			.pipe(browser.stream())
});

export {
	BUILD_STYLES
};