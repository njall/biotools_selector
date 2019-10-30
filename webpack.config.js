var path = require('path')
var webpack = require('webpack')


module.exports = {
  entry: './src/index.js',
  output: { 
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            'sass-loader'
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js']
  },

  devServer: {
    contentBase: './dist'
  }
};

if (process.env.NODE_ENV === 'production') {

  var HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports.devtool = '#source-map'
  
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: '"production"'
          }
      }),
      new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
              warnings: false
          }
      }),
      new webpack.LoaderOptionsPlugin({
          minimize: true
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: '../index.html',
        version: gitRevisionPlugin.version(),
        inject: false,
      })
  ])
}

