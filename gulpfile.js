'use strict';

const gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      nunjucksRender = require('gulp-nunjucks-render'),
      sass = require('gulp-sass'),
      uglify = require('gulp-uglify'),
      webserver = require('gulp-webserver'),
      crypto = require('crypto'),
      fs = require('fs'),
      glob = require('glob'),
      path = require('path'),
      moduleImporter = require('sass-module-importer');

const paths = {
  templates: ['templates/*.html'],
  sass: ['assets/sass/**/*.scss', 'assets/sass/**/*.sass'],
  js: ['assets/js/**/*.js'],
  vendorjs: ['node_modules/jquery/dist/jquery.min.js'],
  assets: ['docs/**/*.css', 'docs/**/*.js'],
};

const calcAssetHash = () => {
  let result = {};
  for (let i = 0; i < paths.assets.length; i++) {
    let files = glob.sync(paths.assets[i]);
    for (let j = 0; j < files.length; j++) {
      let file = files[j];
      if (fs.statSync(file).isFile()) {
        let data = fs.readFileSync(file);
        let hash = crypto.createHash('md5');
        hash.update(data.toString(), 'utf8');
        result[path.basename(file)] = hash.digest('hex');
      }
    }
  }
  return result;
};

gulp.task('sass', () => {
  return gulp.src(paths.sass)
    .pipe(sass({
      outputStyle: 'compressed',
      importer: moduleImporter(),
    }))
    .on('error', (err) => {
      return console.log(err.stack);
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      remove: false,
    }))
    .pipe(gulp.dest('docs/css'));
});

gulp.task('js', () => {
  gulp.src(paths.js)
    .pipe(uglify())
    .on('error', (err) => {
      return console.log(err.stack);
    })
    .pipe(gulp.dest('docs/js'));
});

gulp.task('compile-template', () => {
  let assetHash = calcAssetHash();
  let manageEnv = (env) => {
    env.addGlobal('helper', {
      asset: (file) => {
        if (file in assetHash) {
          return file + '?v=' + assetHash[file].substring(0, 10);
        }
        return file;
      },
    });
  };
  return gulp.src(paths.templates)
    .pipe(nunjucksRender({
      path: ['templates/'],
      manageEnv: manageEnv,
    }))
    .pipe(gulp.dest('docs'));
});

gulp.task('webserver', () => {
  gulp.src('docs')
    .pipe(webserver({
      port: 8030,
      livereload: true,
      open: true,
    }));
});

gulp.task('vendor', () => {
  gulp.src(paths.vendorjs, {base: 'node_modules'})
    .pipe(gulp.dest('docs/js/vendor'));
});

gulp.task('watch', ['sass', 'js', 'compile-template'], () => {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.templates, ['compile-template']);
});

gulp.task('default', ['watch', 'webserver']);
