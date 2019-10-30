module.exports = {
  entry: './src/index.js',
  output: { 
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
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
