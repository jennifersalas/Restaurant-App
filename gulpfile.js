const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat")
const babel = require("gulp-babel");

gulp.task("default",
  ["styles", "copy-scripts", `copy-html`, `copy-img`, `copy-serviceWorker`, `copy-data`],
  function() {
  gulp.watch("./app/data/*.json", [`copy-data`]);
  gulp.watch("./app/sass/**/*.scss", ["styles"]);
  gulp.watch("./app/js/**/*.js", ["copy-scripts"]);
  gulp.watch("./app/**/*.html", ["copy-html"]);
  gulp.watch("./app/img/*", ["copy-img"]);
  gulp.watch("./app/*.js", [`copy-serviceWorker`]);
  console.log(`now watching`);

  browserSync.init({
    server: "./docs/"
  });
});

gulp.task("styles", function() {
  gulp
    .src("./app/sass/**/*.scss")
    .pipe(sass({
      outputStyle: `compressed`
    }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("./docs/css"))
    .pipe(browserSync.stream());
});

gulp.task(`copy-html`, function () {
  gulp.src(`./app/**/*.html`)
    .pipe(gulp.dest(`./docs`))
})
gulp.task(`copy-img`, function () {
  gulp.src(`./app/img/*`)
    .pipe(gulp.dest(`./docs/img`))
})

gulp.task(`copy-scripts`, function () {
  gulp
    .src(`./app/js/*.js`)
    .pipe(gulp.dest(`./docs/js`));
})

gulp.task(`copy-serviceWorker`, function () {
  gulp
    .src(`./app/*.js`)
    .pipe(gulp.dest(`./docs/`));
})

gulp.task(`copy-data`, function () {
  gulp
    .src(`./app/data/*.json`)
    .pipe(gulp.dest(`./docs/data/`));
});
