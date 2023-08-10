const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  entry: { bundle: path.resolve(__dirname, "src/script.js") },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
    assetModuleFilename: "assets/[name][ext]",
  },
  devtool: "source-map",
  devServer: {
    watchFiles: ["src/**/*"],
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: "3500",
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_nodules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },

      // {
      //   test: /\.(png|svg|jpg|jpeg)$/i,
      // use: [
      //   {
      //     loader: "file-loader",
      //     options: {
      //       name: "[name].[ext]",
      //       outputPath: "assets/",
      //       publicPath: "assets/",
      //     },
      //   },
      // ],
      //   type: "asset/resource",
      // },
      // {
      //   test: /\.(png|svg|jpg|jpeg)$/i,
      //   use: "file-loader",
      // },
      {
        test: /\.(jpg|jpeg|png|gif|pdf|ico|svg)$/,
        // use: [
        // {
        // loader: "file-loader",
        // options: {
        //   name: "assets/[name].[ext]",
        // },
        // },
        // ],
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({ $: "jquery" }),
    new HtmlWebpackPlugin({
      // title: "title webpack",
      filename: "index.html",
      template: "src/index.html",
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
