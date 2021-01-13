const path = require('path');
module.exports = {
  entry: './client/src/App.jsx',
  output: {
    path: path.resolve(__dirname, 'client', 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: path.resolve(__dirname, 'client','src'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css?/,
        include: path.resolve(__dirname, 'client','src'),
        loader: ["style-loader", "css-loader"]
      }
    ]
  }
}