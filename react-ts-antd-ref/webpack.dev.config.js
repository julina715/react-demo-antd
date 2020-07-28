const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack')
// 读取同一目录下的 base config
const baseWebpackConfig = require('./webpack.base.config')
const merge = require('webpack-merge')
const config = require('./config')
const HOST = process.env.HOST
// 端口号为命令行输入的PORT参数或者配置文件中的默认值
const PORT = process.env.PORT && Number(process.env.PORT)
// 将 Hol-reload 热重载的客户端代码添加到 webpack.base.conf 的 对应 entry 中，一起打包
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./scripts/dev-client'].concat(baseWebpackConfig.entry[name])
})
module.exports = merge(baseWebpackConfig, {
    devtool: 'eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html'
        }),
    ],
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        // 使用热模块替换
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        // 监听的端口
        port: PORT || config.dev.port,
        // 自动打开页面
        open: config.dev.autoOpenBrowser,
        // 显示打包进度
        progress: true,
        // 报错在页面打出
        overlay: config.dev.errorOverlay
          ? { warnings: false, errors: true }
          : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
          poll: config.dev.poll,
        }
      }
});
