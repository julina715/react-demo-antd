const path = require('path'); // webpack依赖包，无需单独下载
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin')
// 读取同一目录下的 base config
const baseWebpackConfig = require('./webpack.base.config')
const merge = require('webpack-merge')
const config = require('./config')
baseWebpackConfig.output.publicPath = '/static/'; // 打包后的静态资源的请求路径
var webpackConfig=  merge(baseWebpackConfig, {
    plugins:[
        // 模块提升，减小体积
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: config.build.index
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './server.config.json'),
            to: __dirname + '/dist',
            ignore: ['.*']
        }]),
    ]
});

if (config.build.bundleAnalyzerReport) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
// 压缩js
if (config.build.min) {
    webpackConfig.plugins.push(
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                ie8: false,
                output: {
                    comments: false,
                    beautify: false
                },
                compress: {
                    drop_console: true
                },
                warnings: false
            }
        })
    );
}

module.exports = webpackConfig