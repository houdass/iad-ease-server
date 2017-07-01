const gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ lazy: true });


gulp.task('start', () => {
    log('*** Start nodemon ***');
    $.nodemon({
        script: './app.js',
        ext: 'js',
        env: {
            PORT: 8000
        },
        ignore: ['./node_modules/**']
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


gulp.watch(['**/*.spec.js', '**/*.int.js'], ['test']);


// Reusable functions

function log(msg) {
    $.util.log($.util.colors.green(msg));
}