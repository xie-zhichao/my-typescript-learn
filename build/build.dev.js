const gulp = require('gulp');
const del = require("del");
const tsc = require("gulp-typescript");
const tsProject = tsc.createProject("../tsconfig.json");
const glob = require('glob');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const es = require('event-stream');

gulp.task('clean', function () {
    del(['../examples/**'], { force: true });
});

gulp.task('compile-ts', () => {
    return gulp.src(['../src/**/*.ts'])
        .pipe(tsProject())
        .on('error', function(err) {
            console.log('ts compile error!', err);
            this.emit('end');
        })
        .js
        .pipe(gulp.dest('../examples/'));
});

gulp.task('bundle', ['compile-ts'], () => {
    const entries = glob.sync('../examples/**/app.js');
    const tasks = entries.map(entry => {
        return browserify(entry)
        .bundle()
        .on('error', function(err) {
            console.log('browserify bundle error!', err);
            this.emit('end');
        })
        .pipe(source('main.js')) // gives streaming vinyl file object
        .pipe(buffer())
        .pipe(gulp.dest(entry.replace(/[^\/]+$/, '')));
    });
    
    return es.merge.apply(null, tasks);
});

gulp.task('compile-json', () => {
    return gulp.src(['../src/**/*.json'])
        .pipe(gulp.dest('../examples/'));
});

gulp.task('compile-html', () => {
    return gulp.src(['../src/**/*.html'])
        .pipe(gulp.dest('../examples/'));
});

gulp.task('compile-resource', () => {
    return gulp.src(['../src/**/resource/**'])
        .pipe(gulp.dest('../examples/'));
});

gulp.task('auto', () => {
    gulp.watch('../src/**/*.ts', ['compile-ts', 'bundle']);
    gulp.watch('../src/**/*.json', ['compile-json']);
    gulp.watch('../src/**/*.html', ['compile-html']);
    gulp.watch('../src/**/resource/**', ['compile-resource']);
});

gulp.task('default', ['compile-ts', 'bundle', 'compile-json', 'compile-html', 'compile-resource', 'auto']);