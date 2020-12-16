const gulp = require("gulp");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync");
const babel = require("gulp-babel");

//setting : paths
const paths = {
  root: "./",
  jsSrc: "./assets/src/*.js",
  jsDist: "./assets/js/",
};

//gulpコマンドの省略
const { watch, series, task, src, dest, parallel } = require("gulp");

// browser-sync
task("browser-sync", () => {
  return browserSync.init({
    server: {
      baseDir: paths.root,
    },
    port: 8080,
    reloadOnRestart: true,
  });
});

// browser-sync reload
task("reload", done => {
  browserSync.reload();
  done();
});

task("babel", () => {
  return src(paths.jsSrc)
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(dest(paths.jsDist));
});

//watch
task("watch", done => {
  watch([paths.jsSrc], series("babel", "reload"));
  done();
});
task("default", parallel("watch", "browser-sync"));
