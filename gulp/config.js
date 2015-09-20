var webpack = require("webpack");
var path = require('path');

var dest = './dest'; // 出力先ディレクトリ
var src = './src';  // ソースディレクトリ
var relativeSrcPath = path.relative('.', src);

module.exports = {
    src: src,
    dest: dest,

    // jade
    jade: {
        src: [
            src + '/www/**/!(_)*.jade'
        ],
        dest: dest,
        options: {pretty: true}
    },

    // js
    js: {
        src: src + '/js/**',
        dest: dest + '/js',
        uglify: false
    },

    // webpack
    webpack: {
        entry: {
            app: './src/js/app.js',
            simple: './src/js/simple.js',
            japan: './src/js/japan.js'
        },
        output: {
            filename: '[name].bundle.js'
        },
        resolve: {
            extensions: ['', '.js']
        },
        plugins: [
            new webpack.optimize.DedupePlugin(),
            new webpack.ProvidePlugin({
                jQuery: "jquery",
                $: "jquery",
                jquery: "jquery"
            })
        ],
        loaders: [
            { test: /jquery\.js$/, loader: 'expose?$' },
            { test: /jquery\.js$/, loader: 'expose?jQuery' }
        ]
    },

    // stylus
    stylus: {
        src: [
            src + '/styl/**/!(_)*'
        ],
        dest: dest + '/css/',
        output: 'app.css',  // 出力ファイル名
        autoprefixer: {
            browsers: ['last 2 versions']
        },
        minify: false
    },

    // copy
    copy: {
        src: [
            src + '/www/**/*.!(jade)'
        ],
        dest: dest,
        libdir: ['lib/**/*.js', 'lib/**/*.css', 'lib/**/*.png'],
        mdldir: ['node_modules/material-design-lite/*.min.js', 'node_modules/material-design-lite/*.min.css']
    },

    // watch
    watch: {
        js: relativeSrcPath + '/js/**',
        styl: relativeSrcPath + '/styl/**',
        jade: relativeSrcPath + '/www/**',
        www: relativeSrcPath + '/www/**'
    }

};
