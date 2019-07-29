const gulp = require('gulp');
const del = require("del");
const tsc = require("gulp-typescript");
const tsProject = tsc.createProject("../tsconfig.json");
const tsDtsProject = tsc.createProject("../tsconfig.json", {
    declaration: true,
    noResolve: false
});

gulp.task('clean', function () {
    del(['../dist/**'], {force: true});
});

gulp.task('compile-js', () => {
    return gulp.src(['../src/**/*.js'])
        .pipe(gulp.dest('../dist/'));
});

gulp.task('compile-ts', () => {
    return gulp.src(['../src/**/*.ts'])
        .pipe(tsProject())
        .js.pipe(gulp.dest('../dist/'));
});

gulp.task('compile-dts', () => {
    return gulp.src(['../src/**/*.ts'])
        .pipe(tsDtsProject())
        .dts.pipe(gulp.dest('../dist/'));
});

gulp.task('compile-json', () => {
    return gulp.src(['../src/**/*.json'])
        .pipe(gulp.dest('../dist/'));
});

gulp.task('compile-html', () => {
    return gulp.src(['../src/**/*.html'])
        .pipe(gulp.dest('../dist/'));
});

gulp.task('auto', () => {
    gulp.watch('../src/**/*.ts', ['compile-ts', 'compile-dts']);
    gulp.watch('../src/**/*.js', ['compile-js']);
    gulp.watch('../src/**/*.json', ['compile-json']);
    gulp.watch('../src/**/*.html', ['compile-html']);
});

gulp.task('default', ['compile-js', 'compile-ts', 'compile-dts', 'compile-json', 'compile-html']);