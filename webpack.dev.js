'use strict'

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const setMPA = () => {
    const entry = {

    };
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index\.js/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
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
    // entry:'./src/index.js',
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[hash:8].js'
    },
    mode: 'development',
    module: {
        rules: [{
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new CleanWebpackPlugin(),
        ...htmlWebpackPlugins,
        new FriendlyErrorsWebpackPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
        stats:'errors-only'
    },
    devtool:'source-map'
}