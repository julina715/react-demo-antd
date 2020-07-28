const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin'); // 检测循环依赖
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 将css代码合并为一个文件
const theme = require('./theme'); // antd less 变量
const config = require('./config')
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    entry: {
        app: [
            './src/index.tsx'
        ]
    },
    output: {
        path: config.build.assetsRoot,
        filename: isProduction ? '[name]_[chunkhash:5].js' : '[name].js',
        publicPath: '/',
        chunkFilename: isProduction ? '[name]_[chunkhash:5].js' : '[name].js'
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.// 配置寻找模块的规则
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            useBabel: true,
                            // useCache: true, // 使用缓存，可以提高编译速度
                            errorsAsWarnings: true, // 报错显示为警告，这样不会阻止hmr
                            reportFiles: ['src/**/*.{ts,tsx}'],
                            forceIsolatedModules: true
                        }
                    },
                    // {
                    //     loader: path.join(__dirname, 'src/utils/tsxPx2RemLoader'),
                    //     options: {
                    //       remUnit: 192,
                    //       remPrecision: 10
                    //     }
                    //   }
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader:'px2rem-loader',
                            options: {
                                remUnit: 192, //根据视觉稿，rem为px的十分之一，1920px宽度 = 192rem， 1rem = 100px
                                remPrecision: 10
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                modifyVars: theme
                            }
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'typings-for-css-modules-loader',
                            options: {
                                camelCase: true, // 输出驼峰格式
                                importLoaders: 1, // 前置loader个数
                                localIdentName: isProduction ? 'TZ_[hash:base64:5]' : '[path]__[local]', // 生成的类名
                                minimize: isProduction ? true : false,
                                modules: true, // 开启css modules
                                namedExport: true, // 导出方式
                                sass: true,
                                silent: true, // 静默
                                sourceMap: isProduction ? false : true,
                                banner:
                                    '// 这个文件是自动生成、自动修改的，目的是解决引入scss时的ts报错.\n// 请不要修改这个文件!'
                            }
                        },
                        {
                            loader:'px2rem-loader',
                            options: {
                                remUnit: 192, //根据视觉稿，rem为px的十分之一，1920px宽度 = 192rem， 1rem = 100px
                                remPrecision: 10
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        
                    ]
                })
            },
            {
                test: /\.(mp4|png|svg|jpg|gif|woff2?|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                // 正式环境下混淆命名
                                return isProduction ? '[sha512:hash:base64:8].[ext]' : '[path][name].[ext]';
                            }
                        }
                    }
                ]
            },
            {

                test:/\.html$/,
                use: [
                    {
                        loader:'html-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        // 剔除momentjs无用的语言包
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
        // 将共同的引用文件打包
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: (module, count) =>
                (module.context && module.context.indexOf('node_modules') !== -1) || count >= 2
        }),
        // // 将echarts单独打包
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'echarts',
        //     async: true,
        //     minChunks: (module, count) =>
        //         module.context && (module.context.indexOf('echarts') >= 0 || module.context.indexOf('zrender') >= 0)
        // }),
        // 将echarts单独打包
        new webpack.optimize.CommonsChunkPlugin({
            name: 'chartjs',
            async: true,
            minChunks: (module, count) => module.context && module.context.indexOf('chart.js') >= 0
        }),
        // 将父chunk和子chunk相同的部分打包，并异步加载
        new webpack.optimize.CommonsChunkPlugin({
            children: true, // 检测子chunk
            async: true, // 异步
            minChunks: 3 // 最小共同chunks数为3
        }),
        // 打包css
        new ExtractTextPlugin({
            filename: isProduction ? '[name]_[contenthash:5].css' : '[name].css',
            allChunks: true // 打包所有chunk的
        }),
        // 检查环形依赖
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            // add errors to webpack instead of warnings
            failOnError: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
}