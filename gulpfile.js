var gulp = require("gulp");
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var uglify = require("gulp-uglify");

var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

// var qcdn = require('@q/qcdn');
// var sftp = require('gulp-sftp');

// 清除dist文件夹
gulp.task('clean', function () {
    return gulp.src('./dist', { read: false }).pipe(clean());
});

// 生成核心依赖包
gulp.task('concat', function () {
    return gulp.src(['public/script/core/jquery-1.11.3.js',
            'public/script/core/require-2.3.3.js',
            'public/script/core/require.config.js'
        ])
        .pipe(concat('jquery.require.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// webpack生成组件包
gulp.task('webpack', function () {
    return gulp.src('./src/*/*.js')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest('./dist'));
});

// 打包后的包上传到cdn
gulp.task('qcdn', function () {
    qcdn.upload('./dist', {
        // keepName: true, // windows环境不支持“保持文件名”...
        force:true, 
        all:true,
        domains:["s7.qhres.com"]
    }).then(function (map) {
        // 不保持文件名：http://s7.qhres.com/static/12dff3213dd312.js
        // 保持文件名：http://s7.qhres.com/!2312kdf/jquery.require.js
        console.log(map);
    });
});

// 把资源上传到开发机
gulp.task('sftp', function () {
    var createSftp = function (path) {
        return sftp({
            host: '172.23.12.16',
            user: 'fanlong-so',
            pass: 'Fanlong@2046',
            remotePath: '/home/fanlong-so/component/' + path + '/'
        });
    };

    gulp.src('./dist/**/*').pipe(createSftp('dist'));
});

// 
var taskList = ['clean', 'concat', 'webpack'];

gulp.task('build', taskList);

gulp.task('cdn', taskList.concat('qcdn'));

gulp.task('release', taskList.concat('qcdn'));
