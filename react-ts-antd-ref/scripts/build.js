
// 设置当前环境为生产环境
process.env.NODE_ENV = 'production'

// loading 插件
// https://github.com/sindresorhus/ora
var ora = require('ora')
// 可以在 node 中执行`rm -rf`的工具
// https://github.com/isaacs/rimraf
var rm = require('rimraf')
// 在终端输出带颜色的文字
// https://github.com/chalk/chalk
var chalk = require('chalk')
var path = require('path')
var webpack = require('webpack')
// 配置文件
var config = require('../config')
var webpackConfig = require('../webpack.prod.config')

// 在终端显示loading效果，并输出提示
var spinner = ora('building for production...')
spinner.start()
// 删除这个文件夹 （递归删除）（删除打包后的文件夹，重新生成打包后的文件）
rm(path.resolve(__dirname, '../dist'), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    // 构建成功
    // 停止 loading动画（编译成功的回调函数）
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    // 打印提示
    console.log(chalk.cyan('  Build complete.\n'))
  })
})