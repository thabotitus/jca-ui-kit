/**
* GULPFILE.JS
* - setting up a modern web development environment 
*/
var gulp = require('gulp');

/**
* Import gulp plugins
* - gulp-babel (JS compiler)
* - gulp-plumber (prevent pipe breaking coused by errors from gulp plugins)
* - gulp-concat (concatenate js files)
* - gulp-sass (SASS compiler)
* - gulp-notify (messages)
* - sourcemaps (maps CSS back to SASS files)
* - sassGlob (allow to use glob imports in scss files)
* - imageMin (minify image format - png, jpeg, gif and svn)
* - cleanCSS (css optimizer)
* - gulp-autoprefixer (add vendor prefixes to CSS rules)
* - gulp-browser-sync (create external link for browsing)
* - webpack-stream (adding webpack tehnology)
* - webpackconfig (webpack file with configuration)
*/
const babel							= require('gulp-babel');
const plumber						= require('gulp-plumber');
const concat						= require('gulp-concat');
const sass							= require('gulp-sass');
const notify						= require('gulp-notify');
const sourcemaps				= require('gulp-sourcemaps');
const sassGlob					= require('gulp-sass-glob');
const imageMin					= require('gulp-imagemin');
const cleanCSS					= require('gulp-clean-css');
const autoprefixer			= require('gulp-autoprefixer');
const htmlmin 					= require('gulp-htmlmin');
const clean 						= require('gulp-clean');
const bump							= require('gulp-bump');
const browserSync				= require('browser-sync').create();

//Webpack config
const webpack 					= require('webpack-stream');
const webpackconfig			= require('./webpack.config.js');
// const { task } = require('gulp');

//Set sass compiler
sass.compiler 					= require('node-sass');

const TASKS = {
	CLEAN: 			'clean:dist',
	BUMP_MAJOR: 'bump:major',
	BUMP_MINOR: 'bump:minor',
	BUMP_PATCH: 'bump:patch',
	SERVE: 			'serve',
	SCRIPTS: 		'script',
	STYLES: 		'sass',
	IMAGES: 		'image',
	HTML: 			'build:dist:html',
};

const DIST_FOLDERS = {
	CSS: 'css',
	ROOT: 'dist',
};

const DIST_OUTPUT_FILE_NAMES = {
	CSS: 'styles.css',
};

gulp.task(
  TASKS.CLEAN,
  function () {
    return gulp.src([`${DIST_FOLDERS.ROOT}/*`], { read: false }).pipe(clean());
  });

//Task script // , {since: gulp.lastRun('script')}
gulp.task(
	TASKS.SCRIPTS,
	function(done){
		return gulp.src(['./src/**/*.js'])
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			.pipe(webpack(webpackconfig), webpack)
			.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/js`))
			.pipe(browserSync.stream())
			.pipe(notify({message: "JS task completed!"}))
});

//Task style // , {since: gulp.lastRun('sass')}
gulp.task(
	TASKS.STYLES,
	function(){
		return gulp.src(['./src/sass/**/*.scss'])
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			.pipe(sourcemaps.init())
			.pipe(sassGlob())
			.pipe(sass({
				style: 'compressed',
				errLogToConsole: false,
				onError: function(error_message) {
					return notify().write(error_message);
				}
			}))
			.pipe(autoprefixer())
			.pipe(cleanCSS({
				compatibility: 'ie9',
				level: {
					1: {
						specialComments: 'all',
					}
				}
			}))
			.pipe(sourcemaps.write())
			.pipe(concat(`${DIST_OUTPUT_FILE_NAMES.CSS}`))
			.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/${DIST_FOLDERS.CSS}`))
			.pipe(browserSync.stream())
			// .pipe(notify({message: "Style task completed!"}))
});

//Task image // , {since: gulp.lastRun('image')}
gulp.task(
	TASKS.IMAGES,
	function(){
		return gulp.src(['./images/**/*.+(png|jpg|jpeg|gif|svg|ico)'])
			.pipe(plumber())
			.pipe(imageMin({
				progressive: true,
							interlaced: true,
							pngquant: true,
				verbose: true,
			}))
			.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/images`))
			.pipe(browserSync.stream())
			.pipe(notify({message: "Image task completed!"}))
});

//Script task
// gulp.task('gulp:script', gulp.series(['script']));

//SASS task
// gulp.task('gulp:sass', gulp.series(['sass']));

//Image task
// gulp.task('gulp:image', gulp.series(['image']));

// Version bump
gulp.task(
	TASKS.BUMP_MAJOR,
	function(done){
		gulp.src('./*.json')
		.pipe(bump({type:'major'}))
		.pipe(gulp.dest('./'));
		done();
});

gulp.task(
	TASKS.BUMP_MINOR,
	function(done){
		gulp.src('./*.json')
		.pipe(bump({type:'minor'}))
		.pipe(gulp.dest('./'));
		done();
});

gulp.task(
	TASKS.BUMP_PATCH,
	function(done){
		gulp.src('./*.json')
		.pipe(bump({type:'patch'}))
		.pipe(gulp.dest('./'));
		done();
});

gulp.task(
	TASKS.HTML,
  function(done){
    gulp.src(['./src/**/*.html'])
			.pipe(htmlmin({ collapseWhitespace: true }))
			.pipe(gulp.dest(`${DIST_FOLDERS.ROOT}`));
    done();
	}
);
	
//Default task
gulp.task(
	'default',
	gulp.series(
		[
			TASKS.CLEAN,
			TASKS.SCRIPTS,
			TASKS.STYLES,
			TASKS.HTML,
		]
	)
);

//Build task
gulp.task(
	TASKS.SERVE,
	function(){
		browserSync.init({
			server: `./${DIST_FOLDERS.ROOT}`,
			port: 4000,
			open: true,
		})
		gulp.watch('./src/components/**/*.js', gulp.series([TASKS.SCRIPTS]));
		gulp.watch('./src/sass/**/*.scss', gulp.series([TASKS.STYLES]));
		gulp.watch('./images/**/*.+(png|jpg|jpeg|gif|svg|ico)', gulp.series([TASKS.IMAGES]));
		gulp.watch('./src/**/*.html', gulp.series([TASKS.HTML]));
})

