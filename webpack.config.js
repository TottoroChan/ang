var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // плагин минимизации
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    'script/polyfills.js': './src/polyfills.ts',
    'script/app.js': './src/main.ts',
  },
  output: {
    path: path.resolve(__dirname, './public'),     // путь к каталогу выходных файлов - папка public
    filename: "[name]"       // название создаваемого файла
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/style.css' }),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core/,
      path.resolve(__dirname, 'src'), // каталог с исходными файлами
      {} // карта маршрутов
    ),
    //new UglifyJSPlugin(),
  ],
  module: {
    rules: [   //загрузчик для ts
      {
        test: /\.ts$/, // определяем тип файлов
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: path.resolve(__dirname, 'tsconfig.json') }
          },
          'angular2-template-loader'
        ]
      }, {
        test: /\.html$/,
        loader: 'html-loader'
      }, {
        test: /\.(sa|sc|c)ss$/,
        use: [
         MiniCssExtractPlugin.loader,
         { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
         { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        app: {
          name: "app",
        },
        polyfills: {
          name: "polyfills",
        }
      }
    }
  }
}