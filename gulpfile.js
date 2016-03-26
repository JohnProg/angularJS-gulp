// Load Gulp
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),

    INPUT  = {
      'stylesheets': 'app/styles/**/*.css',
      'javascript': 'app/scripts/**/*.js',
      'vendorjs': 'app/libs/**/*.js',
      'img': 'app/images/*.{gif,jpg,png}'
    },

// Define base folders and files names
    OUTPUT = {
        names: {
            'appjs': 'app.min.js',
            'vendorjs': 'plugins.min.js'
        },
        routes: {
            'stylesheets': 'public/assets/stylesheets',
            'javascript': 'public/assets/javascript',
            'img': 'public/assets/images',
        }
    },

// Define messages
    MESSAGES = {
        'stylesheets': 'Styles task complete',
        'javascript': 'Scripts angularJS task complete',
        'vendorjs': 'Scripts libs task complete',
        'img': 'Images task complete'
    },

// Browser definitions for autoprefixer
    AUTOPREFIXER_BROWSERS = [
        'last 3 versions',
        'ie >= 8',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10',
        '> 5%',
        'firefox < 20',
        'safari 7',
        'safari 8',
        'IE 8',
        'IE 9',
        'IE 10',
        'IE 11'
    ];

// Start Watching: Run "gulp"
gulp.task('default', ['watch']);
// Minify jQuery Plugins: Run manually with: "gulp squish-jquery"
gulp.task('build-js-lib', function() {
  return gulp.src(INPUT.vendorjs)
    .pipe(plugins.uglify())
    .pipe(plugins.concat(OUTPUT.names.vendorjs))
    .pipe(gulp.dest(OUTPUT.routes.javascript))
    .pipe(plugins.notify({ message: MESSAGES.vendorjs }));
});

/* run javascript through jshint */
gulp.task('jshint', function() {
  return gulp.src(INPUT.javascript)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Minify Custom JS: Run manually with: "gulp build-js"
gulp.task('build-js', function() {
  return gulp.src(INPUT.javascript)
    .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat(OUTPUT.names.appjs))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest(OUTPUT.routes.javascript))
    .pipe(plugins.notify({ message: MESSAGES.javascript }));
});
//gulp.src(['src/**/module.js', 'src/**/*.js'])

gulp.task('build-img', function() {
  return gulp.src(INPUT.img)
    .pipe(plugins.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest(OUTPUT.routes.img))
    .pipe(plugins.notify({ message: MESSAGES.img }));
});

// CSS: Run manually with: "gulp build-css"
gulp.task('build-css', function() {
    return gulp.src(INPUT.stylesheets)
        .pipe(plugins.sourcemaps.init())  // Process the original sources
            .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
            .pipe(plugins.minifyCss({compatibility: 'ie8'}))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(OUTPUT.routes.stylesheets))
        .pipe(plugins.notify({ message: MESSAGES.stylesheets }));
});
//gulp.src(['src/**/main.css', 'src/**/*.css'])


gulp.task('watch', ['build-js', 'build-js-lib', 'build-img', 'build-css'], function () {

  // Create LiveReload server
  plugins.livereload.listen(35729, function (err) {
      if (err) return console.log(err);
  });

  gulp.watch(INPUT.javascript, ['jshint', 'build-js']);
  gulp.watch(INPUT.vendorjs, ['build-js-lib']);
  gulp.watch(INPUT.stylesheets, ['build-css']);
  gulp.watch(INPUT.img, ['build-img']);

  // Watch any files in build/, reload on change
  gulp.watch(['./index.html', 'public/**']).on('change', plugins.livereload.changed);
});