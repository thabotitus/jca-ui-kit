
import gulp from 'gulp';
import clean from 'gulp-clean';
import browserSync from 'browser-sync';

const browser = browserSync.has('jca-ui')
  ? browserSync.get('jca-ui')
  : browserSync.create('jca-ui');

import './build/scripts.js';
import './build/styles.js';
import './build/images.js';
import './build/html.js';
import './build/data.js';
import './build/bump.js';

import { DISTRIBUTION_FOLDERS, INPUT_FOLDERS, TASKS } from './build/config.js';

gulp.task(
  TASKS.CLEAN,
  function () {
    return gulp.src([`${DISTRIBUTION_FOLDERS.ROOT}/*`, './dist'], { read: false, allowEmpty: true }).pipe(clean());
  });
	
gulp.task(
	TASKS.BUILD,
	gulp.series(
		[
			TASKS.CLEAN,
			TASKS.JS,
			TASKS.STYLES,
			TASKS.IMAGES,
			TASKS.HTML_PAGES,
			TASKS.HTML_INDEX,
			TASKS.COPY_DATA
		]
	)
);

gulp.task(
	TASKS.SERVE,
	function(){
		browser.init({
			server: `./${DISTRIBUTION_FOLDERS.ROOT}`,
			port: 4000,
			open: true,
		})
		gulp.watch(`${INPUT_FOLDERS.JS}/**/*.js`, gulp.series([TASKS.JS]));
		gulp.watch(`${INPUT_FOLDERS.CSS}/**/*.+(scss|css)`, gulp.series([TASKS.STYLES]));
		gulp.watch(`${INPUT_FOLDERS.IMAGES}/**/*.+(png|jpg|jpeg|gif|svg|ico)`, gulp.series([TASKS.IMAGES]));
		gulp.watch(`${INPUT_FOLDERS.ROOT}/**/*.njk`, gulp.series([TASKS.HTML_INDEX, TASKS.HTML_PAGES]));
})
