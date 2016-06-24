"use strict";
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  entry: __dirname + "/src/app.tsx",
  output: {
    path: __dirname + "/build2",
    filename: 'app.js'
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [/node_modules/]
      }/*, {
        test: /\.css$/,
        loader: 'style!css',
      }, {
        test: /\.(png|jpg|otf|eot|svg|ttg|woff2?)$/,
        loader: 'file-loader',
        include: [/node_modules/]
      }*/
    ]
  },

  resolve: {
    extensions: ['', '.ts', '.tsx', '.js','.jsx'],
    modulesDirectories: ['node_modules']
  },

  //watch: true,
  watchOptions: {
    aggregateTimeout: 50
  },

  devtool: "source-map",

  plugins: [
    new CopyWebpackPlugin([
      {from: 'index.html'},
      // {from: 'content/**/*'},
      // {from: './node_modules/font-awesome/fonts/*'},
      {from: 'node_modules/simplemde/dist/simplemde.min.css', to: 'style'},
      {from: 'node_modules/react-tagsinput/react-tagsinput.css', to: 'style'},
      {from: 'node_modules/font-awesome/css/font-awesome.min.css', to: 'style'}
    ], {
      copyUnmodified: false
    })
  ]
};