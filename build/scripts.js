'use strict'
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpack from 'webpack-stream';
import { WEBPACK_CONFIG } from '../webpack.config.js';
import browserSync from 'browser-sync';
import { DISTRIBUTION_FOLDERS } from './config.js';

const browser = browserSync.has('jca-ui')
  ? browserSync.get('jca-ui')
  : browserSync.create('jca-ui');

gulp.task(
	'build:javascript',
	function(done){
		return gulp.src('/')
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			.pipe(webpack(WEBPACK_CONFIG), webpack)
			.pipe(gulp.dest(`${DISTRIBUTION_FOLDERS.ROOT}/${DISTRIBUTION_FOLDERS.JS}`))
			.pipe(browser.stream())
});
