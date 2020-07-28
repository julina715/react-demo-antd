// 详情见文档：https://vuejs-templates.github.io/webpack/env.html
var serverConfig = require('../server.config.json')
var path = require('path')

/** 获取本地ip地址 许添加 **/
const os = require('os');
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
const host = getIPAdress();
/** 获取本地ip地址 **/
module.exports = {
  // production 生产环境
  build: {
    // 构建环境
    env: require('./prod.env'),
    // 构建输出的index.html文件
    index: path.resolve(__dirname, '../dist/index.html'),
    // 构建输出的静态资源路径
    assetsRoot: path.resolve(__dirname, '../dist/static'),
    // 构建输出的二级目录
    assetsSubDirectory: 'static',
    // 构建发布的根目录，可配置为资源服务器域名或 CDN 域名
    assetsPublicPath: './',
    // 是否开启 cssSourceMap
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 默认关闭 gzip，因为很多流行的静态资源主机，例如 Surge、Netlify，已经为所有静态资源开启gzip
    productionGzip: true,
    // 需要使用 gzip 压缩的文件扩展名
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 运行“build”命令行时，加上一个参数，可以在构建完成后参看包分析报告
    // true为开启，false为关闭
    bundleAnalyzerReport: process.env.npm_config_report,
    min: true  //压缩js
  },
  // dev 开发环境
  dev: {
    // 构建环境
    env: require('./dev.env'),
    // IP
    host: host,
    // 端口号
    port: 8080,
    // 是否自动打开浏览器
    autoOpenBrowser: true,
    // 报错在页面打出
    errorOverlay: true,
    // 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // proxyTable 代理的接口（可跨域）
    // 使用方法：https://vuejs-templates.github.io/webpack/proxy.html
    proxyTable: {
      '/gateway': {
        target: 'http://' + serverConfig.server.ip + ':' + serverConfig.server.port,
        secure: false,          // 接受 运行在 https 上的服务
        changeOrigin: true,     // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/gateway': '/'       // 地址映射表
        }
      },
      '/intelligence-web-static': {
        target: 'http://' + serverConfig.system.static,
        secure: false,          // 接受 运行在 https 上的服务
        changeOrigin: true,     // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/intelligence-web-static': '/'       // 地址映射表
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
