/**
* GULPFILE.JS
* - setting up a modern web development environment 
*/
var gulp = require('gulp');
var DISTRIBUTION_FOLDER = 'dist';

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

//Set sass compiler
sass.compiler 					= require('node-sass');

gulp.task(
  'clean:dist',
  function () {
    return gulp.src([`${DISTRIBUTION_FOLDER}/*`], { read: false }).pipe(clean());
  });

//Task script
gulp.task('script', function(done){
	return gulp.src(['./src/**/*.js'], {since: gulp.lastRun('script')})
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(webpack(webpackconfig), webpack)
		.pipe(gulp.dest(`./${DISTRIBUTION_FOLDER}/js`))
		.pipe(browserSync.stream())
		.pipe(notify({message: "JS task completed!"}))
});

//Task style
gulp.task('sass', function(){
	return gulp.src(['./sass/**/*.scss'], {since: gulp.lastRun('sass')})
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
		.pipe(concat('style.css'))
		.pipe(gulp.dest(`./${DISTRIBUTION_FOLDER}/css`))
		.pipe(browserSync.stream())
		.pipe(notify({message: "Style task completed!"}))
});

//Task image
gulp.task('image', function(){
	return gulp.src(['./images/**/*.+(png|jpg|jpeg|gif|svg|ico)'], {since: gulp.lastRun('image')})
		.pipe(plumber())
		.pipe(imageMin({
			progressive: true,
            interlaced: true,
            pngquant: true,
			verbose: true,
		}))
		.pipe(gulp.dest(`./${DISTRIBUTION_FOLDER}/images`))
		.pipe(browserSync.stream())
		.pipe(notify({message: "Image task completed!"}))
});

//Script task
gulp.task('gulp:script', gulp.series(['script']));

//SASS task
gulp.task('gulp:sass', gulp.series(['sass']));

//Image task
gulp.task('gulp:image', gulp.series(['image']));

// Version bump
gulp.task('bump:major', function(done){
  gulp.src('./*.json')
  .pipe(bump({type:'major'}))
	.pipe(gulp.dest('./'));
	done();
});

gulp.task('bump:minor', function(done){
  gulp.src('./*.json')
  .pipe(bump({type:'minor'}))
	.pipe(gulp.dest('./'));
	done();
});

gulp.task('bump:patch', function(done){
  gulp.src('./*.json')
  .pipe(bump({type:'patch'}))
	.pipe(gulp.dest('./'));
	done();
});

gulp.task('build:dist:html',
  function(done){
    gulp.src(['./src/*.html'])
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`${DISTRIBUTION_FOLDER}`));
    // gulp.src(['./src/demos/**/*.html'])
    //     .pipe(htmlmin({ collapseWhitespace: true }))
    //     .pipe(gulp.dest(`${DISTRIBUTION_FOLDER}/demos`));
    done();
	});
	
//Default task
gulp.task('default', gulp.series(['clean:dist', 'script', 'sass', 'build:dist:html']));

gulp.task('build:bump', gulp.series(['clean:dist', 'script', 'sass', 'build:dist:html']));

//Build task
gulp.task('serve', function(){
	browserSync.init({
		server: `./${DISTRIBUTION_FOLDER}`,
		port: 3000,
		open: false,
	})
	gulp.watch('./src/components/**/*.js', gulp.series(['script']));
	gulp.watch('./sass/**/*.scss', gulp.series(['sass']));
	gulp.watch('./images/**/*.+(png|jpg|jpeg|gif|svg|ico)', gulp.series(['image']));
})

