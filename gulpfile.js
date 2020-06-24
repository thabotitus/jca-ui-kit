const gulp 							= require('gulp');
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
const nunjucksRender 		= require('gulp-nunjucks-render');
const browserSync				= require('browser-sync').create();
const webpack 					= require('webpack-stream');
const webpackconfig			= require('./webpack.config.js');
sass.compiler 					= require('node-sass');
const version  					= require('./package.json').version;
const uglify						= require('gulp-uglify');

const TASKS = {
	CLEAN: 							'clean',
	BUMP_MAJOR: 				'bump:major',
	BUMP_MINOR: 				'bump:minor',
	BUMP_PATCH: 				'bump:patch',
	SERVE: 							'serve',
	SCRIPTS: 						'script',
	STYLES: 						'sass',
	IMAGES: 						'image',
	HTML_PAGES: 				'nunjucks:pages',
	HTML_INDEX: 				'nunjucks:index',
	HTML: 							'html',
	COPY: 							'copy',
	CSS_DIST: 					'css:dist',
	JS_DIST: 						'js:dist',
	BUILD_DEPENDENCIES: 'build:dependencies'
};

const DIST_FOLDERS = {
	CSS: 'css',
	IMAGES: 'img',
	ROOT: 'docs',
	JS: 'js',
};

const DIST_OUTPUT_FILE_NAMES = {
	CSS: `jca-ui-kit.min.css`,
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
    return gulp.src([`${DIST_FOLDERS.ROOT}/*`, './dist'], { read: false, allowEmpty: true }).pipe(clean());
  });

gulp.task(
	TASKS.SCRIPTS,
	function(done){
		return gulp.src([`${INPUT_FOLDERS.JS}/**/*.js`])
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			.pipe(webpack(webpackconfig), webpack)
			.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/${DIST_FOLDERS.JS}`))
			.pipe(browserSync.stream())
});

gulp.task(
	TASKS.JS_DIST,
	function(done){
		return gulp.src([`${INPUT_FOLDERS.JS}/**/*.js`])
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			.pipe(webpack(webpackconfig), webpack)
			.pipe(gulp.dest('./dist'))
});

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
});

gulp.task(
	TASKS.CSS_DIST,
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
			.pipe(concat(`jca-ui-kit-${version}.min.css`))
			.pipe(gulp.dest(`./dist`))
			.pipe(browserSync.stream())
});

gulp.task(TASKS.HTML_PAGES, function() {
  return gulp.src(['src/pages/**/*.njk'])
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
	.pipe(gulp.dest(`${DIST_FOLDERS.ROOT}/pages`))
	.pipe(browserSync.stream());
});

gulp.task(TASKS.HTML_INDEX, function() {
  return gulp.src(['src/index.njk'])
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
	.pipe(gulp.dest(`${DIST_FOLDERS.ROOT}`))
	.pipe(browserSync.stream());
});

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

gulp.task(TASKS.BUILD_DEPENDENCIES, () => {
  return gulp.src([
		'node_modules/@popperjs/core/dist/umd/popper.min.js',
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
		'node_modules/imask/dist/imask.min.js',
		'node_modules/gemini-scrollbar/index.js',
		'./src/js/prism.js'
	])
    .pipe(babel({
      presets: ['@babel/preset-env']
		}))
		.pipe(concat('jca_dependencies.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(`./${DIST_FOLDERS.ROOT}/${DIST_FOLDERS.JS}`))
});
	
gulp.task(
	'default',
	gulp.series(
		[
			TASKS.CLEAN,
			TASKS.SCRIPTS,
			TASKS.STYLES,
			TASKS.IMAGES,
			TASKS.HTML_INDEX,
			TASKS.HTML_PAGES,
			TASKS.CSS_DIST,
			TASKS.JS_DIST,
			TASKS.BUILD_DEPENDENCIES
		]
	)
);

gulp.task(
	TASKS.SERVE,
	function(){
		browserSync.init({
			server: `./${DIST_FOLDERS.ROOT}`,
			port: 4000,
			open: true,
		})
		gulp.watch(`${INPUT_FOLDERS.JS}/**/*.js`, gulp.series([TASKS.SCRIPTS, TASKS.BUILD_DEPENDENCIES]));
		gulp.watch(`${INPUT_FOLDERS.CSS}/**/*.+(scss|css)`, gulp.series([TASKS.STYLES]));
		gulp.watch(`${INPUT_FOLDERS.IMAGES}/**/*.+(png|jpg|jpeg|gif|svg|ico)`, gulp.series([TASKS.IMAGES]));
		gulp.watch(`${INPUT_FOLDERS.ROOT}/**/*.njk`, gulp.series([TASKS.HTML_INDEX, TASKS.HTML_PAGES]));
})
