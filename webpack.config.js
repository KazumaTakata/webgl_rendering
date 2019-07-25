var path = require('path')

module.exports = {
  entry: './test/normalmap/index.js',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules']
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
