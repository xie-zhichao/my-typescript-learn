const gulp = require('gulp');
const del = require("del");
const tsc = require("gulp-typescript");
const tsProject = tsc.createProject("../tsconfig.json");
const tsDtsProject = tsc.createProject("../tsconfig.json", {
    declaration: true,
    noResolve: false
});
const glob = require('glob');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const es = require('event-stream');
const uglify = require('gulp-uglify');

gulp.task('clean', function () {
    del(['../dist/**'], {force: true});
});

gulp.task('compile-ts', () => {
    return gulp.src(['../src/**/*.ts'])
        .pipe(tsProject())
        .js.pipe(gulp.dest('../dist/'));
});

gulp.task('bundle', ['compile-ts'], () => {
    const entries = glob.sync('../dist/**/app.js');
    const tasks = entries.map(entry => {
        return browserify(entry)
        .bundle()
        .pipe(source('main.js')) // gives streaming vinyl file object
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(entry.replace(/[^\/]+$/, '')));
    });
    
    return es.merge.apply(null, tasks);
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

gulp.task('compile-resource', () => {
    return gulp.src(['../src/**/resource/**'])
        .pipe(gulp.dest('../dist/'));
});

gulp.task('default', ['compile-ts', 'bundle', 'compile-dts', 'compile-json', 'compile-html', 'compile-resource']);
