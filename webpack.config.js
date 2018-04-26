const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js',
    './node_modules/fontawesome/index.js' // not yet working
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },{
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      },{
        test: /\.scss$/,
        use: [{
            loader: 'style-loader'
          },{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },{
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
        include: /src/
      },{
        test: /\.css$/,
        include: /node_modules/,
        loader: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@Components': path.resolve(__dirname, 'src/Components'),
      '@Modules': path.resolve(__dirname, 'src/Modules'),
      '@Stores': path.resolve(__dirname, 'src/Stores'),
      '@Constants': path.resolve(__dirname, 'src/Constants')
    }
  },
  output: {
    path: path.resolve(__dirname + '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true
  }
};
