'use strict'
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpack from 'webpack-stream';
import { WEBPACK_CONFIG } from '../webpack.config.js';
import browserSync from 'browser-sync';
import { DISTRIBUTION_FOLDERS, INPUT_FOLDERS } from './config.js';
import gulpEsbuild  from "gulp-esbuild";

const browser = browserSync.has('jca-ui')
  ? browserSync.get('jca-ui')
  : browserSync.create('jca-ui');

gulp.task('build:javascript', function () {
	return gulp
	  .src([`${INPUT_FOLDERS.JS}/app.js`, `${INPUT_FOLDERS.JS}/custom.js`])
	  .pipe(
		plumber({
		  errorHandler: notify.onError("Error: <%= error.message %>"),
		})
	  )
	  .pipe(gulpEsbuild({
		outdir: `./`,
		entryNames: './[name].min',
		bundle:     true,
		minify:     true,
		sourcemap:  false,
		metafile:   true
	  }))
	  .pipe(gulp.dest(`${DISTRIBUTION_FOLDERS.ROOT}/${DISTRIBUTION_FOLDERS.JS}`))
	  .pipe(browser.stream());
  });
