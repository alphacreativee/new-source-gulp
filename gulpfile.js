const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

// Production?
const isProd = process.env.NODE_ENV === "production";

// JS → chỉ nén + .min
function js() {
  return src("assets/js/index/*.js", { allowEmpty: true })
    .pipe(uglify({ compress: { drop_console: isProd } }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("assets/main/js"))
    .pipe(browserSync.stream());
}

// SCSS → CSS thường + CSS.min (không autoprefixer)
function css() {
  return src("assets/scss/*.scss", { allowEmpty: true })
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest("assets/main/css")) // file CSS thường
    .pipe(cleanCSS({ compatibility: "ie11" })) // nén mạnh
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("assets/main/css"))
    .pipe(browserSync.stream());
}

// Server + Watch
function serve() {
  browserSync.init({
    server: "./",
    notify: false,
    open: false,
  });

  watch("assets/js/index/*.js", js);
  watch("assets/scss/**/*.scss", css);
  watch("*.html").on("change", browserSync.reload);
}

exports.default = series(parallel(js, css), serve);
exports.build = series(parallel(js, css));
