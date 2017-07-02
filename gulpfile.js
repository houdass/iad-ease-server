const gulp = require('gulp'),
    exec = require('child_process').exec,
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')({ lazy: true });

gulp.task('start', ['apidoc'], () => {
    log('*** Start Project ***');
    $.nodemon({
        script: './app.js',
        ext: 'js',
        env: {
            PORT: 8000
        },
        ignore: ['./node_modules/**']
    })
        .on('start', () => {
            const msg = {
                title: 'Server Started.',
                'message': 'Rest API is ready!'
            };
            startBrowserSync();
            notify(msg);
        })
        .on('restart', () => {
            log('*** Restarting nodemon ***');
        });
});


gulp.task('test', () => {
    log('*** Start tests ***');
    $.env({vars: { ENV: 'test' }});
    gulp.src(['**/*.spec.js', '**/*.integration.js'], { read: true })
        .pipe($.mocha());
});

gulp.task('apidoc', (cb) => {
    log('*** Start apidoc ***');
    exec('npm run apidoc', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Static server
gulp.task('browser-sync', ['apidoc'], () => {
    browserSync.init({
        port : 8000,
        server: {
            baseDir: './'
        }
    });
});

// Watchers
gulp.watch(['**/*.spec.js', '**/*.int.js'], ['test']);
gulp.watch(['./routers/**/*.js'], ['apidoc']);

// Reusable functions

function log(msg) {
    $.util.log($.util.colors.green(msg));
}

function notify(options) {
    const notifier = require('node-notifier');
    notifier.notify(options);
}

function startBrowserSync() {
    if (browserSync.active) {
        return;
    }

    browserSync.init({
        port : 3000,
        files: 'public/index.html',
        server: {
            baseDir: './public'
        }
    });
}


