const
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  minifyHtml = require('gulp-minify-html'),
  uglifycss = require('gulp-uglifycss'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  concatCss = require('gulp-concat-css'),
  browserSync = require("browser-sync").create();

/*
  -- TOP LEVEL FUNCTIONS 
  gulp.task - Define tasks
  gulp.src - Point to files to use
  gulp.dest - Points to folder to output
  gulp.watch - Watch files and folders for changes

  Root
  |____ dist
  |    |_____ css/style.min.css
  |    |
  |    |_____ js/app.min.js
  |    |
  |    |_____ images/*
  |    |
  |    |_____ assets/* 
  |    |
  |     *.html
  |     
  |____ src
  |    |_____ scss
  |    |     |____ *.scss
  |    |
  |    |_____ js
  |    |     |____ *.js
  |    |
  |    |_____ images
  |    |     |____ *
  |    |
  |    |_____ assets // do nothing. just copy.
  |    |     |____ *
  |    |
  |     *.html



*/

// Logs Message
gulp.task('message', function (done) {
  console.log('Gulp is running...');
  done();
});

// copy assets
gulp.task('assets', function (done) {
  gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
  done();
});
gulp.task('php', function (done) {
  gulp.src('src/*.php')
    .pipe(gulp.dest('dist'));
  done();
});

// copy HTML
gulp.task('html', function (done) {
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
  done();
});

// Optimize Images
gulp.task('imageMin', function (done) {
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
  done();
});

// Compile and minify sass
gulp.task('sass', async function (done) {
  gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('style.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
  done();
});

// Scripts
gulp.task('js', async function (done) {
  gulp.src('src/js/*.js')
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
  done();
});


// browser-sync
gulp.task('browser-sync', gulp.series('sass', async function () {

  browserSync.init({
    server: "./dist/",
    open: false,
    notify: false
  });

  gulp.watch("src/sass/*.scss", gulp.series('sass'));
  gulp.watch("src/*.html").on('change', browserSync.reload);
}));
gulp.task('js-watch', gulp.series('js', function (done) {
  browserSync.reload();
  done();
}));


// default task
gulp.task('default', async function () {
  return gulp.series('message', 'html', 'imageMin', 'sass', 'js', 'browser-sync', 'php')
});

gulp.task('watch', gulp.parallel('browser-sync', async function (done) {
  gulp.watch('src/*.php', gulp.series('php'));
  gulp.watch('src/js/*.js', gulp.series('js'));
  gulp.watch('src/images/*', gulp.series('imageMin'));
  gulp.watch('src/sass/*.scss', gulp.series('sass'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/scss/*.scss', gulp.series('sass'));
  gulp.watch('src/*.html', browserSync.reload);
  done();
}));

// minifying all codes
gulp.task('build', async function (done) {
  console.log('... js');
  gulp.src('src/js/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

  console.log('... scss');
  gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('style.min.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('dist/css'));

  console.log('... html');
  gulp.src('src/*.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist'));

  done();
});
