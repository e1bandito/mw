"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const sassGlob = require("gulp-sass-glob");
const sourcemaps = require("gulp-sourcemaps");
const server = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const del = require("del");
const gcmq = require("gulp-group-css-media-queries");
const webpack = require("webpack-stream");
const pug = require("gulp-pug");
const prettify = require("gulp-jsbeautifier");
const getData = require("jade-get-data")("src/data");
const svgSymbols = require("gulp-svg-symbols");
const gulpIf = require("gulp-if");
const ghPages = require("gulp-gh-pages");
const argv = require("yargs").argv;
const glob = require('glob');
const path = require('path');
const critical = require('critical');

const isDev = true;
const isProd = !isDev;

function toObject(paths) {
  const entry = {};
  paths.forEach(function (p) {
    const name = path.basename(p, '.js');
    entry[name] = p;
  });
  return entry;
}

let webpackConf = {
  entry: toObject(glob.sync('./src/js/*.js')),
  output: {
    filename: "[name].min.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
    ],
  },
  mode: argv.dev ? "development" : "production",
  devtool: argv.dev ? "eval-source-map" : "none",
};

// Critical css

gulp.task('criticalCss', (done) => {
  let cssPaths = glob.sync('./build/css/*.css')
  cssPaths.forEach(async page => {
    await critical.generate({
      inline: true,
      base: './build/',
      src: `${path.basename(page, '.css')}.html`,
      target: {
        html: `${path.basename(page, '.css')}.html`,
      },
      width: 1340,
      height: 600,
      ignore: ['@font-face']
    })
  });
  server.stream;
  done();
});


// Автопрефиксы и минификация стилей
gulp.task("defaultCss", (done) => {
  gulp
    .src("src/sass/pages/*.scss")
    .pipe(plumber())
    .pipe(gulpIf(argv.dev, sourcemaps.init()))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpIf(argv.prod, gcmq()))
    .pipe(gulpIf(argv.prod, csso()))
    .pipe(gulpIf(argv.dev, sourcemaps.write()))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
  done();
});



// Минификация js
gulp.task("js", () => {
  return gulp
    .src(["src/js/*.js", "!js/**/*.min.js"])
    .pipe(plumber())
    .pipe(webpack(webpackConf))
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());
});

// pug

gulp.task("pug", () => {
  return gulp
    .src("src/pug/pages/*.pug")
    .pipe(plumber())
    .pipe(pug({ data: { getData } }))
    .pipe(pug({ pretty: true }))
    .pipe(
      prettify({
        braceStyle: "expand",
        indent_size: 2,
        indentInnerHtml: true,
        preserveNewlines: true,
        endWithNewline: true,
        wrapLineLength: 120,
        maxPreserveNewlines: 50,
        wrapAttributesIndentSize: 1,
        unformatted: ["use"],
      })
    )
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

// Оптимизация изображений
gulp.task("images", () => {
  return gulp
    .src("src/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ progressive: true }),
      ])
    )
    .pipe(gulp.dest("src/img"));
});

// Конвертация в webp
gulp.task("webp", () => {
  return gulp
    .src("src/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("src/img"));
});

// svg-sprite
gulp.task("sprite", () => {
  return gulp
    .src("src/img/svg-sprite/*.svg")
    .pipe(
      svgSymbols({
        title: false,
        id: "icon_%f",
        class: "%f",
        templates: ["default-svg"],
      })
    )
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [
            { optimizationLevel: 3 },
            { progessive: true },
            { interlaced: true },
            { removeViewBox: false },
            { removeUselessStrokeAndFill: true },
            { cleanupIDs: false },
            { cleanupAttrs: true },
            { removeMetadata: true },
            { removeTitle: true },
            { removeAttrs: { attrs: "(fill|stroke|data-name)" } },
          ],
        }),
      ])
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("src/img"));
});

// Очиска build
gulp.task("clean", () => {
  return del("build");
});

// Копирование в build
gulp.task("copy", () => {
  return gulp
    .src(["src/fonts/**", "src/img/**"], {
      base: "src/",
    })
    .pipe(gulp.dest("build"));
});

// gh-pages
gulp.task("gh-pages", function () {
  return gulp.src("build/**/*").pipe(ghPages());
});

// Watcher
gulp.task("serve", () => {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });
  gulp.watch("src/components/**/*.scss", gulp.series("styles"));
  gulp.watch("src/blocks/**/*.scss", gulp.series("styles"));
  gulp.watch("src/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("src/js/**", gulp.series("js"));
  gulp.watch("src/components/**/*.js", gulp.series("js"));
  gulp.watch("src/blocks/**/*.js", gulp.series("js"));
  gulp.watch("src/pug/**/*.pug", gulp.series("pug"));
  gulp.watch("src/data/**/*.json", gulp.series("pug"));
  gulp.watch("src/components/**/*.pug", gulp.series("pug"));
  gulp.watch("src/blocks/**/*.pug", gulp.series("pug"));
  gulp.watch("src/fonts/*", gulp.series("copy"));
  gulp.watch("src/img/*", gulp.series("copy"));
});

gulp.task("styles",
  gulp.series(gulp.parallel("pug", "defaultCss"), "criticalCss")
)

// Сборка в build
gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("copy", "defaultCss", "js", "pug"), "criticalCss")
);
