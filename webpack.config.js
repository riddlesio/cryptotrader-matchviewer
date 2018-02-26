const path = require('path');
const webpack = require('webpack');

module.exports = function (config) {

    const babelPlugins  = [];
    const environment   = config.environment;
    const variables     = '?' + environment.target + '&' + environment.platform + (environment.debug ? '&DEBUG' : '');

    if (!environment.debug) {
        babelPlugins.push('transform-remove-console');
    }

    var webpackConfig = {
        resolve: {
            fallback: path.join(__dirname, '../node_modules'),
        },
        resolveLoader: {
            root: path.join(__dirname, '/node_modules'),
        },
        module: {
            preLoaders: [
                {
                    loader: 'preprocess' + variables,
                    exclude: /node_modules\/(?!@?riddles)/,
                },
            ],
            loaders: [
                {
                    test: /.js(x)?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules\/(?!(@?riddles|koa-compose|co))/,
                    query: {
                        cacheDirectory: true,
                        presets: ['react', 'es2015', 'stage-0'],
                        plugins: babelPlugins,
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'json',
                },
                {
                    // https://github.com/webpack-contrib/svg-inline-loader
                    test: /\.svg$/,
                    loader: 'svg-inline-loader?classPrefix',
                },
            ],

            // fixes npm install problem (https://github.com/isagalaev/highlight.js/issues/895)
            noParse: [/autoit\.js$/],
        },
        plugins: [

            // Deduplication plugin
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                comments: false,
                compress: {
                    warnings: false,
                },
            }),
        ],
    };

    if (environment.debug) {
        // Gives you sourcemaps without slowing down rebundling
        webpackConfig.devtool = 'inline-source-map';
    }

    return webpackConfig;
};
