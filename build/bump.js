'use strict'
import gulp from 'gulp';
import bump from 'gulp-bump';

const ROOT = './';
const source = ['./version.json', './package.json', './package-lock.json'];

gulp.task(
	'bump:major',
	function() {
		return gulp.src(source).pipe(bump({ type:'major' })).pipe(gulp.dest(ROOT));
  });

gulp.task(
	'bump:minor',
	function() {
		return gulp.src(source).pipe(bump({ type:'minor' })).pipe(gulp.dest(ROOT));
  });

gulp.task(
	'bump:patch',
	function() {
		return gulp.src(source).pipe(bump({ type:'patch' })).pipe(gulp.dest(ROOT));
  });