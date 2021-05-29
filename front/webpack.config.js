const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js"
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html"),
            filename: "index.html",
            minify: false
        }),
        new MiniCssExtractPlugin({
            filename: "main.css",
        })
    ],
    module : {
        rules: [
            {
                test: /\.css$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader,'css-loader','sass-loader']
            }
        ]
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 4200,
        liveReload: true,
        open: true
    }
}