const {series, dest, parallel} = require("gulp");
var ts = require("gulp-typescript");
var tsProjectProd = ts.createProject("tsconfig.prod.json");
var source = require('vinyl-source-stream');
var tsProject = ts.createProject("tsconfig.json");
var browserify = require("browserify");
var uglify = require("gulp-uglifyes");
var buffer = require("vinyl-buffer");

function tscProd() {
    return tsProjectProd.src()
        .pipe(tsProjectProd())
        .pipe(dest('dist'))
        .once("error", function () {
            this.once("finish", function () {
                process.exit(1);
            });
        });
}

function tsc() {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(dest('.'))
        .once("error", function () {
            this.once("finish", function () {
                process.exit(1);
            });
        });
}

function bundle() {
    return browserify({
        standalone: "OfflineTs"
    })
        .add("index.ts")
        .plugin("tsify")
        .bundle()
        .pipe(source("offlinets.js"))
        .pipe(dest("dist"));
}

function bundleMin() {
    return browserify({
        standalone: "OfflineTs"
    })
        .add("index.ts")
        .plugin("tsify")
        .bundle()
        .pipe(source("offlinets.min.js"))
        .pipe(buffer())
        .pipe(uglify({
            mangle: {
                keep_classnames: true,
                keep_fnames: true,
            }
        }))
        .pipe(dest("dist"));
}
function demo() {
    return browserify()
        .add("demo/DemoObserver.ts")
        .plugin("tsify")
        .bundle()
        .pipe(source("DemoObserver.js"))
        .pipe(dest("demo/public"));
}

exports.build = series(tscProd, parallel(bundle, bundleMin));
exports.tsc = tsc;
exports.demo = demo;
