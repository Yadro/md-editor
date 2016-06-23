"use strict";

module.exports = {

  entry: "./src/app.tsx",
  output: {
    path: __dirname + "/build_2",
    filename: "app.js"
  },

  module: {
    loaders: [{
      test: /\.tsx?$/,
      path: './src',
      loader: 'ts-loader'
    }]
  },

  //watch: true,
  watchOptions: {
    aggregateTimeout: 50
  },

  devtool: "source-map",
};