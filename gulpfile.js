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
const copy							= require('gulp-copy');
const browserSync				= require('browser-sync').create();

//Webpack config
const webpack 					= require('webpack-stream');
const webpackconfig			= require('./webpack.config.js');

//Set sass compiler
sass.compiler 					= require('node-sass');

const TASKS = {
	CLEAN: 			'clean',
	BUMP_MAJOR: 'bump:major',
	BUMP_MINOR: 'bump:minor',
	BUMP_PATCH: 'bump:patch',
	SERVE: 			'serve',
	SCRIPTS: 		'script',
	STYLES: 		'sass',
	IMAGES: 		'image',
	HTML: 			'html',
	COPY: 			'copy',
};

const DIST_FOLDERS = {
	CSS: 'css',
	IMAGES: 'img',
	ROOT: 'docs',
	JS: 'js',
};

const DIST_OUTPUT_FILE_NAMES = {
	CSS: 'jca-ui-kit.min.css',
};

const INPUT_FOLDERS = {
	IMAGES: './src/img',
	JS: './src/js',
	CSS: './src/styles',
	ROOT: './src',
};

gulp.task(
  TASKS.CLEAN,
  function () {
    return gulp.src([`${DIST_FOLDERS.ROOT}/*`], { read: false }).pipe(clean());
  });

//Task script // , {since: gulp.lastRun('script')}`${INPUT_FOLDERS.JS}/**/*.js`
gulp.task(
	TASKS.SCRIPTS,
	function(done){
		return gulp.src([`${INPUT_FOLDERS.JS}/**/*.js`])
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			// .pipe(webpack(webpackconfig), webpack)
			.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/${DIST_FOLDERS.JS}`))
			.pipe(browserSync.stream())
			.pipe(notify({message: "JS task completed!"}))
});

//Task style // , {since: gulp.lastRun('sass')}
gulp.task(
	TASKS.STYLES,
	function(){
		return gulp.src([`${INPUT_FOLDERS.CSS}/**/*.scss`])
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
		return gulp.src([`${INPUT_FOLDERS.IMAGES}/**/*.+(png|jpg|jpeg|gif|svg|ico)`])
			.pipe(plumber())
			.pipe(imageMin({
				progressive: true,
							interlaced: true,
							pngquant: true,
				verbose: true,
			}))
			.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/${DIST_FOLDERS.IMAGES}`))
			.pipe(browserSync.stream())
			// .pipe(notify({message: "Image task completed!"}))
});

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
	TASKS.COPY,
	function(done){
		return gulp
			.src(`${DIST_FOLDERS.ROOT}`)
			.pipe(copy('./docs'))
			.pipe(gulp.dest('./'));
});

gulp.task(
	TASKS.HTML,
  function(done){
    gulp.src(['./src/**/*.html'])
			.pipe(htmlmin({ collapseWhitespace: true }))
			.pipe(gulp.dest(`${DIST_FOLDERS.ROOT}`))
			.pipe(browserSync.stream());
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
			TASKS.IMAGES,
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
		gulp.watch(`${INPUT_FOLDERS.JS}/**/*.js`, gulp.series([TASKS.SCRIPTS]));
		gulp.watch(`${INPUT_FOLDERS.CSS}/**/*.+(scss|css)`, gulp.series([TASKS.STYLES]));
		gulp.watch(`${INPUT_FOLDERS.IMAGES}/**/*.+(png|jpg|jpeg|gif|svg|ico)`, gulp.series([TASKS.IMAGES]));
		gulp.watch(`${INPUT_FOLDERS.ROOT}/**/*.html`, gulp.series([TASKS.HTML]));
})

