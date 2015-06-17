var gulp = require('gulp'),
    gutil = require('gulp-util'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    uncss = require('gulp-uncss'),
    minifyCss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin');

gulp.task('copy', function() {
    gulp.src(['favicon.ico', '*.js', '!gulpfile.js', 'package.json', 'README.md'])
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-fonts', function() {
    gulp.src('vendor/fonts/**.*')
        .pipe(gulp.dest('dist/vendor/fonts'));
});

gulp.task('copy-server-lib', function() {
    gulp.src('lib/*.js')
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('copy-sounds', function() {
    gulp.src('vendor/sounds/**.*')
        .pipe(gulp.dest('dist/vendor/sounds'));
});

gulp.task('html', function () {
    var assets = useref.assets();

    return gulp.src(['**/*.html', '!uncss.html', '!dist/**/*.html'])
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', ['html'], function () {
    return gulp.src('vendor/css/*.css')
        .pipe(concat('styles.css'))
        .pipe(uncss({
            html: ['uncss.html']
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9']
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/vendor/css'));
});

gulp.task('default', ['css', 'copy', 'copy-sounds', 'copy-fonts', 'copy-server-lib']);
