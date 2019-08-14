const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

gulp.task("default", ["styles"], function() {
  gulp.watch("sass/**/*.scss", ["styles"]);

  browserSync.init({
    server: "./app/"
  });
});

gulp.task("styles", function() {
  gulp
    .src("./app/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("./app/css"))
    .pipe(browserSync.stream());
});
