'use strict'
import gulp from 'gulp';
import browserSync from 'browser-sync';
import nunjucksRender from 'gulp-nunjucks-render';
const  browser = browserSync.create();

const DIST_FOLDERS = {
	ROOT: 'docs',
};


gulp.task('build:html_pages', function() {
  return gulp.src(['src/pages/**/*.njk'])
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
	.pipe(gulp.dest(`${DIST_FOLDERS.ROOT}/pages`))
	.pipe(browserSync.stream());
});

gulp.task('build:html_index', function() {
  return gulp.src(['src/index.njk'])
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
	.pipe(gulp.dest(`${DIST_FOLDERS.ROOT}`))
	.pipe(browser.stream());
});