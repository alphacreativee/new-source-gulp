const { watch, dest, src, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const plumber = require("gulp-plumber");

// ===== PLUGINS TĂNG PERFORMANCE =====
const concat = require("gulp-concat"); // Gộp nhiều file thành 1
const babel = require("gulp-babel"); // Transpile ES6+ → ES5
const sourcemaps = require("gulp-sourcemaps"); // Sourcemap để debug
const imagemin = require("gulp-imagemin"); // Optimize images
const cache = require("gulp-cache"); // Cache để không xử lý lại file không đổi
const autoprefixer = require("gulp-autoprefixer"); // Tự động thêm vendor prefix CSS
const purgecss = require("gulp-purgecss"); // Xóa CSS không dùng
const newer = require("gulp-newer"); // Chỉ xử lý file mới/thay đổi
const del = require("del"); // Xóa thư mục
const notify = require("gulp-notify"); // Thông báo lỗi
const gulpif = require("gulp-if"); // Conditional pipes

// Kiểm tra môi trường
const isProduction = process.env.NODE_ENV === "production";

// ===== 1. TASK JAVASCRIPT - NÂNG CAO =====
function js() {
  return src("assets/js/index/*.js", { allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: notify.onError("JS Error: <%= error.message %>"),
      })
    )
    .pipe(newer("assets/main/js")) // Chỉ xử lý file mới
    .pipe(gulpif(!isProduction, sourcemaps.init())) // Sourcemap cho dev
    .pipe(
      babel({
        presets: ["@babel/preset-env"], // Transpile ES6+ sang ES5
      })
    )
    .pipe(concat("bundle.js")) // Gộp tất cả JS thành 1 file
    .pipe(dest("assets/main/js")) // Lưu file gốc
    .pipe(
      uglify({
        compress: {
          drop_console: isProduction, // Xóa console.log trong production
          drop_debugger: true,
          pure_funcs: isProduction ? ["console.log", "console.info"] : [],
        },
        mangle: true,
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulpif(!isProduction, sourcemaps.write(".")))
    .pipe(dest("assets/main/js"))
    .pipe(browserSync.stream());
}

// ===== 2. TASK SCSS - NÂNG CAO =====
function scss() {
  return src("assets/scss/*.scss", { allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: notify.onError("SCSS Error: <%= error.message %>"),
      })
    )
    .pipe(newer("assets/main/css"))
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(
      sass({
        outputStyle: "expanded",
        includePaths: ["node_modules"], // Import từ node_modules
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions", "> 1%", "IE 11"],
        cascade: false,
      })
    )
    .pipe(dest("assets/main/css")) // CSS gốc (không minify)
    .pipe(
      gulpif(
        isProduction,
        purgecss({
          content: ["*.html", "assets/js/**/*.js"],
          safelist: ["active", "show", "fade", /^data-/], // Giữ lại các class này
        })
      )
    )
    .pipe(
      cleanCSS({
        level: {
          1: {
            specialComments: 0, // Xóa tất cả comments
          },
          2: {
            mergeMedia: true,
            restructureRules: true,
          },
        },
        compatibility: "ie9",
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulpif(!isProduction, sourcemaps.write(".")))
    .pipe(dest("assets/main/css"))
    .pipe(browserSync.stream());
}

function images() {
  return src("assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}", {
    allowEmpty: true,
  })
    .pipe(newer("assets/main/images"))
    .pipe(
      cache(
        imagemin(
          [
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({
              quality: 85,
              progressive: true,
            }),
            imagemin.optipng({
              optimizationLevel: 5,
            }),
            imagemin.svgo({
              plugins: [
                { name: "removeViewBox", active: false },
                { name: "cleanupIDs", active: false },
              ],
            }),
          ],
          {
            verbose: true,
          }
        )
      )
    )
    .pipe(dest("assets/main/images"))
    .pipe(browserSync.stream());
}

function fonts() {
  return src("assets/fonts/**/*", { allowEmpty: true })
    .pipe(newer("assets/main/fonts"))
    .pipe(dest("assets/main/fonts"));
}

function html() {
  return src("*.html").pipe(dest("./")).pipe(browserSync.stream());
}

function clearCache(done) {
  return cache.clearAll(done);
}

function clean() {
  return del(["assets/main"]);
}

function taskWatch() {
  browserSync.init({
    server: {
      baseDir: "./",
      middleware: [require("compression")()],
    },
    injectChanges: true,
    notify: false,
    open: false,
    ghostMode: false,
    logLevel: "silent",
    reloadDebounce: 300,
  });

  watch("assets/js/index/*.js", js);
  watch("assets/scss/**/*.scss", scss);
  watch("assets/images/**/*", images);
  watch("assets/fonts/**/*", fonts);
  watch("*.html").on("change", browserSync.reload);
}

exports.clean = clean;
exports.clearCache = clearCache;
exports.js = js;
exports.scss = scss;
exports.images = images;
exports.fonts = fonts;
exports.html = html;

exports.default = series(clean, parallel(js, scss, images, fonts), taskWatch);

exports.build = series(clean, parallel(js, scss, images, fonts));
