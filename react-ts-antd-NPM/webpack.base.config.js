const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin'); // 检测循环依赖
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 将css代码合并为一个文件

module.exports = env => {
    process.env.NODE_ENV = env.NODE_ENV;
    const isProduction = env.NODE_ENV === 'production';
    return {
        entry: {
            app: ['./src/index.tsx'] // 需要打包的入口文件
        },
        output: {
            filename: isProduction ? '[name]_[chunkhash:5].js' : '[name].js', // 编译输出文件名格式
            publicPath: '/', // 打包后的静态资源的请求路径
            chunkFilename: isProduction ? '[name]_[chunkhash:5].js' : '[name].js' // 没有指定输出名的文件输出的文件名格式
        },
        resolve: {
            // 将“.ts”和“.tx”添加为可解析扩展。
            extensions: ['.ts', '.tsx', '.js', '.json'], // 自动解析确定的拓展名,使导入模块时不带所写拓展名
            modules: [path.resolve(__dirname, 'node_modules')] // 使import后面没写路径直接写文件名的在这个文件夹下寻找
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
                        }
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
                                loader: 'less-loader'
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
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    })
                },
                {
                    test: /\.(png|svg|jpg|gif|woff2?|eot|ttf|otf)$/,
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
                    NODE_ENV: JSON.stringify(env.NODE_ENV)
                }
            })
        ]
    };
};
