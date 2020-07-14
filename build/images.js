'use strict'
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
const  browser = browserSync.create();
import imageMin from 'gulp-imagemin';

import { DISTRIBUTION_FOLDERS, INPUT_FOLDERS } from './config.js';

gulp.task(
	'build:images',
	function(){
		return gulp.src([`${INPUT_FOLDERS.IMAGES}/**/*.+(png|jpg|jpeg|gif|svg|ico)`])
			.pipe(plumber())
			.pipe(imageMin({
				progressive: true,
				interlaced: true,
				pngquant: true,
				verbose: true,
			}))
			.pipe(gulp.dest(`./${DISTRIBUTION_FOLDERS.ROOT}/${DISTRIBUTION_FOLDERS.IMAGES}`))
			.pipe(browser.stream())
});