const commander   = require('commander');
const gulp        = require('gulp');
const plumber     = require('gulp-plumber');
const webpack     = require('@riddles/gulp-js');
const copy        = require('@riddles/gulp-copy');
const css         = require('@riddles/gulp-css');
const images      = require('@riddles/gulp-images');
const config      = require('./gulp/config.json');

commander
    .version('1.0.0')
    .usage('gulp build [flags]')
    .option('--debug',  'Enables debug code and disables minification')
    .option('--dev',    'Instructs compiler to use development config')
    .option('--prod',   'Instructs compiler to use production config')
    .option('--aigames', 'Instructs compiler to target the AIGames platform')
    .option('--riddles', 'Instructs compiler to target the Riddles.io platform')
    .parse(process.argv);

const environment = buildEnvironment(commander);

process.stdout.write('\n');
process.stdout.write('Task config:\n');
process.stdout.write(' platform = ' + environment.platform + '\n');
process.stdout.write(' target   = ' + environment.target + '\n');
process.stdout.write(' debug    = ' + environment.debug + '\n');
process.stdout.write('\n');

function buildEnvironment(argv) {

    const debug    = !!argv.debug;
    const target   = argv.prod ? 'PROD' : 'DEV';
    const platform = argv.prod && argv.riddles ? 'RIDDLES'
        : argv.prod && argv.aigames ? 'AI_GAMES'
        : 'LOCAL';
    return {
        debug:  debug,
        platform: platform,
        target: target,
    };
}

function streamFactory(source) {

    return gulp
        .src(source)
        .pipe(plumber({ errorHandler: console.log.bind(console) }));
}

function buildConfig(taskName) {

    return Object.assign(
        { environment: environment },
        config[taskName]
    );
}

// gulp.task('copyFonts', copy(streamFactory, gulp.dest, buildConfig('copyFonts')));
gulp.task('copyHtml', copy(streamFactory, gulp.dest, buildConfig('copyHtml')));
gulp.task('images', images(streamFactory, gulp.dest, buildConfig('images')));
gulp.task('css',    css(streamFactory, gulp.dest, buildConfig('css')));
gulp.task('js',     webpack(streamFactory, gulp.dest, buildConfig('webpack')));

gulp.task('build', ['js', 'css', 'images', 'copyHtml']);
