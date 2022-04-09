const gulp = require('gulp'),
      sass = require('gulp-sass')(require('sass')),
      plumber = require("gulp-plumber"),
      notify = require("gulp-notify"),
      sourcemaps = require("gulp-sourcemaps"),
      cssnano = require('gulp-cssnano'),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      uglify = require("gulp-uglify"),
      //imagemin = require('gulp-imagemin'),
      cache = require('gulp-cache'),
      browserSync = require("browser-sync").create(),
      injectPartials = require("gulp-inject-partials"),
      del = require("del"),
      zip = require('gulp-zip');

//PATHS
const paths = {
    styles: {
        src: "src/scss/**/*.scss",
        dest: "assets/css/"
    },
    mincss: {
        src: "src/mincss/*",
        dest: "assets/mincss/"
    },
    scripts: {
        src: "src/js/**/*.js",
        dest: "assets/js/"
    },
    minjs: {
        src: "src/minjs/*",
        dest: "assets/minjs/"
    },
    image: {
        src: "src/img/**/*",
        dest: "assets/img/"
    },
    fonts: {
        src: "src/fonts/*",
        dest: "assets/fonts/"
    },
    html: {
        src: "src/templates/**/*.html",
        dest: "./"
    },
};

//WELCOME
gulp.task("hello",function(done){
    console.log("WELCOME TO GULP");
    done();
});

//SASS to CSS
gulp.task("styles", function(done) {
    return (
        gulp
        .src(paths.styles.src)
        .pipe(
            plumber({errorHandler: notify.onError("Error: <%= error.message %>")})
        )
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssnano())
        .pipe(postcss([ autoprefixer
            ({
            browsers: ["last 2 versions"],
            cascade: false
            })
          ]))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.styles.dest))
    );
   
    done();
});

//ALL MINIFIED CSS TO MINCSS FOLDER
gulp.task("mincss", function(done) {
    return gulp
            .src(paths.mincss.src)
            .pipe(gulp.dest(paths.mincss.dest));
    done();
});

//CUSTOM JS TO JS FOLDER
gulp.task("scripts", function() {
    return gulp
           .src(paths.scripts.src)
           .pipe(
                plumber({errorHandler: notify.onError("Error: <%= error.message %>")})
            )
            //.pipe(uglify())
            .pipe(gulp.dest(paths.scripts.dest));
});

//ALL MINIFIED JS TO MINJS FOLDER
gulp.task("minjs", function() {
    return gulp
           .src(paths.minjs.src)
           .pipe(gulp.dest(paths.minjs.dest));
});

//IMAGE OPTIMIZE
gulp.task("image", function() {
    return gulp
           .src(paths.image.src)
          // .pipe(cache(imagemin()))
           .pipe(gulp.dest(paths.image.dest));
});

//ALL FONTS TO FONTS FOLDER
gulp.task("fonts", function() {
    return gulp.src(paths.fonts.src)
               .pipe(gulp.dest(paths.fonts.dest));
});

// //PARTIALS
gulp.task("ptl_render", function() {
    return gulp
        .src([paths.html.src,"!src/templates/partial/*.html"])
        .pipe(
            plumber({errorHandler: notify.onError("Error: <%= error.message %>")})
        )
        .pipe(
            injectPartials({
                removeTags: true,
            })
        )
        .pipe(gulp.dest(paths.html.dest));
});

//WATCH WITH BROWSER SYNC
gulp.task("watch", function() {
    browserSync.init({
      server: {
        baseDir: "./"
      },
    });
gulp.watch(paths.styles.src,gulp.task("styles")).on("change", browserSync.reload);
gulp.watch(paths.html.src,gulp.task("ptl_render")).on("change", browserSync.reload);
gulp.watch(paths.scripts.src,gulp.task("scripts")).on("change", browserSync.reload);
gulp.watch(paths.minjs.src,gulp.task("minjs")).on("change", browserSync.reload);
gulp.watch(paths.mincss.src,gulp.task("mincss")).on("change", browserSync.reload);
gulp.watch(paths.image.src,gulp.task("image")).on("change", browserSync.reload);
gulp.watch(paths.fonts.src,gulp.task("fonts")).on("change", browserSync.reload);
});

//SERVE TASK   
gulp.task("serve", gulp.parallel(["styles","ptl_render","scripts","image","mincss","minjs","fonts"]));

//DEFAULT TASK   
gulp.task("default", gulp.series(["serve","watch"]));

//CLEAR ALL FOLDER
gulp.task("clearAll", function(done) {
    return del(["assets","./*.html","./build"]);
    done();
});

//CACHE CLEAR   
gulp.task("clearCache", function(done) {
    return cache.clearAll(done);
});

//ZIP
gulp.task("zip", function(done) {
    return (
      gulp.src(["./**/*","!./node_modules/**","!./src/**","!./gulpfile.js","!./package-lock.json","!./package.json"])
          .pipe(zip("project.zip"))
          .pipe(gulp.dest('./build'))
    );
    done();
});

//CLEAR BUILD FOLDER
gulp.task("clearBuild", function(done) {
    return del("./build");
    done();
});
