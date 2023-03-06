const gulp = require("gulp");

gulp.task("licenses", async function () {
  gulp
    .src("build/static/js/*chunk.js", { base: "./" })
    .pipe(gulp.dest("./", { overwrite: true }));

  gulp
    .src("build/index.html", { base: "./" })
    .pipe(gulp.dest("./", { overwrite: true }));

  gulp
    .src("build/static/css/*chunk.css", { base: "./" })
    .pipe(gulp.dest("./", { overwrite: true }));
  return;
});
