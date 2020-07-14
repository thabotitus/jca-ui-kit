'use strict'
import gulp from 'gulp';
import { DISTRIBUTION_FOLDERS } from './config.js';

gulp.task('build:copy_data', () => {
	return gulp.src('./src/data/**/*')
		.pipe(gulp.dest(`./${DISTRIBUTION_FOLDERS.ROOT}/${DISTRIBUTION_FOLDERS.DATA}`));
});
	