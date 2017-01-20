const webpack = require('webpack')
const path = require('path')

const nodeEnv = process.env.NODE_ENV || 'development'
const isBuilding = nodeEnv === 'production'
const sourcePath = path.join(__dirname, './src')
const staticsPath = path.join(__dirname, './build')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const commonPlugins = [
  new ExtractTextPlugin('bundle.css'),
  new HtmlWebpackPlugin({template: './template.html'}),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.js'
  }),
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
  }),
  new webpack.NamedModulesPlugin(),
]

const buildPlugins = [
  new webpack.LoaderOptionsPlugin({minimize: true, debug: false}),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    output: {
      comments: false
    },
  })
]

const devPlugins = [
  new webpack.HotModuleReplacementPlugin()
]

module.exports = function(){
  return {
    context: sourcePath,
    devtool: isBuilding ? 'source-map' : 'eval',
    entry: {
      app: './index.js',
      vendor: ['react']
    },
    output: {
      path: staticsPath,
      filename: '[name].bundle.js'
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: ['css-loader', 'sass-loader']}),
        exclude: /node_modules/
      }]
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: [
        path.resolve(__dirname, 'node_modules'),
        sourcePath
      ]
    },
    devServer: {
      contentBase: sourcePath,
      historyApiFallback: true,
      port: 3000,
      compress: isBuilding,
      inline: !isBuilding,
      hot: !isBuilding,
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: '\u001b[32m',
        }
      },
    },
    plugins: isBuilding
      ? commonPlugins.concat(buildPlugins)
      : commonPlugins.concat(devPlugins)
  }
}
