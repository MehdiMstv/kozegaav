const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { optimize } = require("webpack");
const { join } = require("path");
let prodPlugins = [];

if (process.env.NODE_ENV === "production") {
  prodPlugins.push(
    new optimize.AggressiveMergingPlugin(),
    new optimize.OccurrenceOrderPlugin()
  );
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "inline-source-map",
  entry: {
    contentscript: join(__dirname, "src/contentscript/contentscript.ts"),
    background: join(__dirname, "src/background/background.ts"),
  },
  output: {
    path: join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.json"
          }
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    ...prodPlugins,
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
};
