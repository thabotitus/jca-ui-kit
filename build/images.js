'use strict'
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
const  browser = browserSync.create();
import imageMin from 'gulp-imagemin';

const DIST_FOLDERS = {
	IMAGES: 'img',
	ROOT: 'docs',
};

const INPUT_FOLDERS = {
	IMAGES: './src/img',
	ROOT: './src',
};

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
			.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/${DIST_FOLDERS.IMAGES}`))
			.pipe(browser.stream())
});