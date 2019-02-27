var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // плагин минимизации

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'app': './src/main.ts'
  },
  output: {
    path: path.resolve(__dirname, './public/script'),     // путь к каталогу выходных файлов - папка public
    publicPath: '/public/',
    filename: "[name].js"       // название создаваемого файла
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules:[   //загрузчик для ts
      {
          test: /\.ts$/, // определяем тип файлов
          use: [
           {
               loader: 'awesome-typescript-loader',
               options: { configFileName: path.resolve(__dirname, 'tsconfig.json') }
             } ,
              'angular2-template-loader'
          ]
       },{
         test: /\.html$/,
         loader: 'html-loader'
       }, {
           test: /\.css$/,
           include: path.resolve(__dirname,'src/app'),
           loader: 'raw-loader'
         }
  ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core/,
      path.resolve(__dirname, 'src'), // каталог с исходными файлами
      {} // карта маршрутов
    ),
    new UglifyJSPlugin()
  ],
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