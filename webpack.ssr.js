'use strict'

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const glob = require('glob');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
// const webpack = require('webpack');

const setMPA = () => {
    const entry = {

    };
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'));
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index-server\.js/);
        const pageName = match && match[1];
        if(pageName){
            entry[pageName] = entryFile;
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chunks: ['vendors', pageName],
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBracks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false,
                    }
                }));
        }
    });

    return {
        entry,
        htmlWebpackPlugins
    }
}
const {
    entry,
    htmlWebpackPlugins
} = setMPA();

module.exports = {
    entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-server.js',
        libraryTarget: 'umd'
    },
    mode: 'production',
    module: {
        rules: [{
                test: /.js$/,
                use: [
                    'babel-loader',
                    // 'eslint-loader'
                ]
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        // options here
                        options: {
                            remUni: 75,
                            remPrecision: 8
                        }
                    }
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8][ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module:'react',
        //             // entry:'https://11.url.cn/nowlib/16.2.0/react.min.js',
        //             entry:'https://now8.gtimg.com/now/lib/16.2.0/react.min.js',
        //             global:'React'
        //         },
        //         {
        //             module:'react-dom',
        //             // entry:'https://11.url.cn/nowlib/16.2.0/react-dom.min.js',
        //             entry:'https://now8.gtimg.com/now/lib/16.2.0/react-dom.min.js',
        //             global:'React'
        //         }
        //     ]
        // }),
        ...htmlWebpackPlugins,
        // new webpack.optimize.ModuleConcatenationPlugin()
    ],
    optimization: {
        splitChunks: {
            // cacheGroups: {
            //     commons: {
            //         test: /(react|react-dom)/,
            //         name: 'vendors',
            //         chunks: 'all'
            //     }
            // }
            minSize: 1000,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    // devtool: 'inline-source-map'
}