'use strict'
import gulp from 'gulp';

const DIST_FOLDERS = {
	ROOT: 'docs',
};

gulp.task('build:copy_data', () => {
	return gulp.src('./src/data/**/*')
		.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/data`));
});
	