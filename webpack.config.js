// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')

const resolve = require('./webpack.config.resolve')

const sourceRootPath = path.join(__dirname, 'src')
const assetPath = path.join(__dirname, 'assets')
const distRootPath = path.join(__dirname, 'dist')

const watching = process.env.NODE_ENV === 'watch'

module.exports = {
    watch: watching,
    entry: {
        background: path.join(sourceRootPath, 'background', 'index.js'),
        // options: path.join(sourceRootPath, 'options', 'index.tsx'),
        popup: path.join(sourceRootPath, 'popup', 'index.js'),
        content: path.join(sourceRootPath, 'content', 'index.js'),
    },
    ...resolve,
    output: {
        path: distRootPath,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' }, // creates style nodes from JS strings
                    { loader: 'css-loader' }, // translates CSS into CommonJS
                    { loader: 'less-loader' }, // compiles Less to CSS
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                include: [sourceRootPath],
                use: { loader: 'babel-loader' },
            },
        ],

    },
    plugins: [
        watching ? new ExtensionReloader({
            port: 9090, // Which port use to create the server
            reloadPage: true, // Force the reload of the page also
            entries: { // The entries used for the content/background scripts or extension pages
                contentScript: 'content',
                background: 'background',
                extensionPage: 'popup',
            },
        }) : () => { this.apply = () => { } },
        new HtmlWebpackPlugin({
            template: path.join(assetPath, 'popup.html'),
            inject: 'body',
            filename: 'popup.html',
            title: 'Web Extension Starter - Popup Page',
            chunks: ['popup'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(assetPath, 'img'), to: path.join(distRootPath, 'assets', 'img') },
                { from: path.join(sourceRootPath, 'manifest.json'), to: path.join(distRootPath, 'manifest.json'), toType: 'file' },
            ],
        }),
    ],
}
