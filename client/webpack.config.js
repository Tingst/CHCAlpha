const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = {
  mode: 'development',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js'
  },
  devServer: {
    port: '8080',
    inline: true
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-3', 'react']
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // suppress react devtools console warning
      __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
    })
  ],

};


module.exports = Object.assign({}, base);