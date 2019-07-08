module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.glsl$/i,
        use: 'raw-loader'
      },
      {
        test: /\.obj$/i,
        use: 'raw-loader'
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: 'file-loader'
      }
    ]
  },
  devtool: 'eval-source-map'
}
