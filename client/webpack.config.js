const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/** @type {import('webpack').Configuration} */
module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./client/src/index.ts",
    context: path.resolve(__dirname, ".."),

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name].[contenthash].js" : "[name].js",
      publicPath: "/",
      clean: true,
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i,
          type: "asset/resource",
          generator: {
            filename: "public/[name].[hash][ext]",
          },
        },
        {
          test: /\.css$/i,
          use: [
            // In production: extract to a .css file
            // In development: inject via <style> tags for HMR support
            isProd ? MiniCssExtractPlugin.loader : "style-loader", "css-loader",
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./client/src/index.html",
        favicon: "./client/public/favicon.ico",
        minify: isProd,
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "./client/public", to: "." },
        ],
      }),
      // Only emit a .css file in production
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" })]
        : []),
    ],

    optimization: {
      minimize: isProd,
      splitChunks: {
        chunks: "all",
      },
    },

    devServer: {
      static: path.resolve(__dirname, "dist"),
      port: 3001,
      hot: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ["/api"],
          target: "http://localhost:3000",
        },
      ],
    },

    devtool: isProd ? "source-map" : "inline-source-map",
  };
};