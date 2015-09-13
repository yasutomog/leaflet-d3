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
        uglify: true
    },

    // webpack
    webpack: {
        entry: src + '/js/app.js',
        output: {
            filename: 'bundle.js'
        },
        resolve: {
            extensions: ['', '.js']
        }
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
        libdir: ['lib/**/*.js', 'lib/**/*.css', 'lib/**/*.png']
    },

    // watch
    watch: {
        js: relativeSrcPath + '/js/**',
        styl: relativeSrcPath + '/styl/**',
        jade: relativeSrcPath + '/www/**',
        www: relativeSrcPath + '/www/**'
    }

};
