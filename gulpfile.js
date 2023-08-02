const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));

const scss_path = "scss/";
const css_path = "css/";

function buildStyles() {
  return src(scss_path + "main.scss")
    .pipe(sass())
    .pipe(dest(css_path));
}

function watchTask() {
  watch([scss_path + "main.scss", scss_path + "style.scss"], buildStyles);
}

exports.default = series(buildStyles, watchTask);
