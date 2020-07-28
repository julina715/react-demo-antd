const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 读取同一目录下的 base config
module.exports = env => {
    const config = require('./webpack.base.config')(env);
    config.devtool = 'eval-source-map'; // 开发环境下推荐使用，方便查看源代码
    config.output.path = path.resolve(__dirname, 'build/'); // 打包后的静态资源的存放路径
    config.plugins = [
        ...config.plugins,
        // 通过缓存加速打包
        new HardSourceWebpackPlugin({
            cacheDirectory: path.resolve(__dirname, '.cache/hard-source/[confighash]'),
            configHash: function() {
                return env.NODE_ENV;
            },
            environmentHash: {
                root: process.cwd(),
                directories: [],
                files: [
                    'package-lock.json',
                    'yarn.lock',
                    'theme.js',
                    'webpack.base.config.js',
                    'webpack.build.config.js'
                ]
            }
        }),
        new HtmlWebpackPlugin({
            template: 'index.html', // 源文件，路径相对于本文件所在的位置
            filename: path.resolve(__dirname, 'build/index.html') // 生成文件放到的路径和文件名
        })
    ];
    return config;
};
