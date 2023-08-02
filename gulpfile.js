const { src, dest, watch, series } = require("gulp");
const sassCompiler = require("gulp-sass");
const sass = sassCompiler(require("sass"));

const scss_path = "scss/";
const css_path = "css/";

function buildStyles() {
  return src(scss_path + "style.scss")
    .pipe(sass())
    .pipe(dest(css_path));
}

function watchTask() {
  watch([scss_path + "style.scss"], buildStyles);
}

exports.default = series(buildStyles, watchTask);
