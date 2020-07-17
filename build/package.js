// 'use strict'
import gulp from 'gulp';
import zip from 'gulp-zip';
import { DISTRIBUTION_FOLDERS } from './config.js';
import fs from 'fs';
import clean from 'gulp-clean';
const version = JSON.parse(fs.readFileSync('version.json')).version;

const PACKAGE_NAME = `JCA-UI-KIT_v${version}.zip`;
const DOWNLOADS_FOLDER = './downloads/';

gulp.task('cleanup', () => {
  return gulp.src(DOWNLOADS_FOLDER, { read: false, allowEmpty: true })
    .pipe(clean());
});

gulp.task('zipItUp', () => {
  return gulp.src(`${DISTRIBUTION_FOLDERS.ROOT}/**`)
    .pipe(zip(PACKAGE_NAME))
    .pipe(gulp.dest(DOWNLOADS_FOLDER));
})

gulp.task('build:package', gulp.series(
  [ 'cleanup', 'zipItUp' ]
));