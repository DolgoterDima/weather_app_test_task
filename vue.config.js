const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  publicPath: "dist/vue/index.html",
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // allow access to process.env from within the vue app
        "process.env": {
          WEATHER_API_KEY: JSON.stringify(process.env.WEATHER_API_KEY),
        },
      }),
    ],
  },
});
