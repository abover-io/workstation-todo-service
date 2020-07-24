'use strict';

const path = require('path');

module.exports = {
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  target: 'node',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: [ '.ts', '.js', '.json' ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
