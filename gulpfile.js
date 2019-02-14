const {series, dest} = require("gulp");
var ts = require("gulp-typescript");
var tsProjectProd = ts.createProject("tsconfig.prod.json");
var source = require('vinyl-source-stream');
var tsProject = ts.createProject("tsconfig.json");
var browserify = require("browserify");

function tscProd() {
    console.log("this is the transpilation task for production.");
    console.log("for dev run 'tsc'.");
    return tsProjectProd.src()
        .pipe(tsProject())
        .pipe(dest('dist'))
        .once("error", function () {
            this.once("finish", function () {
                process.exit(1);
            });
        });
};

function tsc() {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(dest('.'))
        .once("error", function () {
            this.once("finish", function () {
                process.exit(1);
            });
        });;
};

function bundle() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['dist/index.js'],
        cache: {},
        packageCache: {},
    })
        .bundle()
        .pipe(source('offlinets.js'))
        .pipe(dest("dist"));
}

exports.bundle = series(tscProd, bundle);
exports.tsc = tsc;

