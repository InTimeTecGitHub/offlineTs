var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProjectProd = ts.createProject("tsconfig.prod.json");
var source = require('vinyl-source-stream');
var tsProject = ts.createProject("tsconfig.json");
var browserify = require("browserify");
gulp.task("tsc-prod", function () {
    console.log("this is the transpilation task for production.");
    console.log("for dev run 'tsc'.");
    return tsProjectProd.src()
        .pipe(tsProject())
        .pipe(gulp.dest('dist'))
        .once("error", function () {
            this.once("finish", function () {
                process.exit(1);
            });
        });
});

gulp.task("tsc", function () {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('.'))
        .once("error", function () {
            this.once("finish", function () {
                process.exit(1);
            });
        });;
});

gulp.task("bundle",
    gulp.series("tsc-prod"),
    function () {
        return browserify({
            basedir: '.',
            debug: true,
            entries: ['dist/index.js'],
            cache: {},
            packageCache: {},
        })
            .bundle()
            .pipe(source('offlinets.min.js'))
            .pipe(gulp.dest("public"));
    });
