"use strict";
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {

  entry: {
    app: path.join(__dirname, "src", "App.tsx"),
    vendor: [
      'react',
      'react-dom',
      'moment',
      'simplemde',
      'react-tagsinput',
      'draft-js'
    ]
  },
  output: {
    path: path.join(__dirname, "build2"),
    filename: 'app.js'
  },

  module: {
    loaders: [
      //{ test: require.resolve("react"), loader: "expose?React" }, // for react dev tools
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [/node_modules/]
      }, {
        test: /\.css$/,
        loader: 'style!css',
      }
    ]
  },

  resolve: {
    extensions: ['', '.ts', '.tsx', '.js','.jsx'],
    modulesDirectories: ['node_modules']
  },

  //watch: true,
  watchOptions: {
    aggregateTimeout: 150
  },

  devtool: "source-map",

  plugins: [
    new CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      filename: 'vendor.js',
      minChunks: Infinity
    }),
    new CopyWebpackPlugin([
      {from: 'index.html'},
      {from: 'content/manifest.json'},
      {from: 'content/background.js'},
      // {from: './node_modules/font-awesome/fonts/*'},
      {from: 'node_modules/simplemde/dist/simplemde.min.css', to: 'style'},
      {from: 'node_modules/react-tagsinput/react-tagsinput.css', to: 'style'},
      {from: 'node_modules/font-awesome/css/font-awesome.min.css', to: 'style'}
    ], {
      copyUnmodified: false
    })
  ]
};